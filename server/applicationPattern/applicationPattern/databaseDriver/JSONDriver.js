// @ts-check
/**
 * <p>This class provides functionality to read and update the flat file JSON database load file in onf format.
 * The interaction with the file system will be performed with the use of 'fs module' which enables interacting with the file system
 * in a way modeled on standard Portable Operating System Interface for UNIX(POSIX) functions. Also by using the 'path' module that provides utilities for 
 * working with files and directory paths.</p>  
 * @author      prathiba.jeevan.external@telefonica.com
 * @since       05.08.2021
 * @version     1.0
 * @copyright   Telefónica Germany GmbH & Co. OHG
 * @module FileOperation
 **/

const fs = require('fs');
const path = require('path');
const primaryKey = require('./PrimaryKey');
const AsyncLock = require('async-lock');
const createHttpError = require('http-errors');

global.databasePath; 

const lock = new AsyncLock();

// in-memory cache and metadata
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // not strictly used for reactive approach but kept if desired

// file watcher and debounce
let watcher = null;
let reloadTimer = null;
const RELOAD_DEBOUNCE_MS = 200;

/**
 * Internal: load JSON from disk into memory.
 * Called lazily on first read or write, and on external change events.
 */
async function loadDatabaseFromDisk() {
    if (!global.databasePath) {
        throw new createHttpError.InternalServerError('Database path not configured');
    }

    try {
        const data = await fs.promises.readFile(global.databasePath, 'utf8');
        const parsed = JSON.parse(data);
        cachedData = parsed;
        cacheTimestamp = Date.now();

        // ensure watcher started when cache first populated
        if (!watcher) {
            startFileWatcher();
        }

        return cachedData;
    } catch (err) {
        // if file not found or JSON invalid, bubble an informative HttpError for callers
        if (err.code === 'ENOENT') {
            throw new createHttpError.InternalServerError(`Database file not found: ${global.databasePath}`);
        }
        if (err instanceof SyntaxError) {
            throw new createHttpError.InternalServerError(`Database file JSON parse error: ${err.message}`);
        }
        throw err;
    }
}

/**
 * Starts fs.watch on the database file to reload cache on external changes.
 * Debounced to avoid multiple reloads on rapid successive events.
 */
function startFileWatcher() {
    if (!global.databasePath) return;

    // if file missing, do nothing; watcher will be attempted again on next load
    try {
        watcher = fs.watch(global.databasePath, (eventType) => {
            // eventType is 'change' or 'rename'
            // debounce reload
            if (reloadTimer) clearTimeout(reloadTimer);
            reloadTimer = setTimeout(async () => {
                try {
                    // reload from disk, but preserve cachedData until new data successfully parsed
                    const data = await fs.promises.readFile(global.databasePath, 'utf8');
                    const parsed = JSON.parse(data);
                    cachedData = parsed;
                    cacheTimestamp = Date.now();
                    console.info(`[JSON-Driver] Cache reloaded from disk due to external change (${eventType})`);
                } catch (err) {
                    console.error(`[JSON-Driver] Failed to reload database after change event: ${err.message}`);
                    // keep old cache if reload fails (avoid replacing with broken JSON)
                }
            }, RELOAD_DEBOUNCE_MS);
        });

        watcher.on('error', (err) => {
            console.error(`[JSON-Driver] File watcher error for ${global.databasePath}: ${err.message}`);
            // we don't throw here; watcher failure is non-fatal. Next read/write will attempt to recreate watcher.
            watcher = null;
        });

        console.info(`[JSON-Driver] Watching ${global.databasePath} for external changes`);
    } catch (err) {
        // if watch fails (permissions etc.), log and continue; cache still works
        console.error(`[JSON-Driver] Failed to start file watcher for ${global.databasePath}: ${err.message}`);
        watcher = null;
    }
}

/**
 * Persist current in-memory coreModelJsonObject to disk.
 * Uses atomic write: write to temp file then rename.
 */
async function persistCacheToDisk(coreModelJsonObject) {
    if (!global.databasePath) {
        throw new createHttpError.InternalServerError('Database path not configured');
    }
    const dir = path.dirname(global.databasePath);
    const tempName = path.join(dir, `.tmp-${path.basename(global.databasePath)}-${Date.now()}`);
    const data = JSON.stringify(coreModelJsonObject);

    // write temp file then rename to be atomic-ish
    await fs.promises.writeFile(tempName, data, 'utf8');
    await fs.promises.rename(tempName, global.databasePath);
    cacheTimestamp = Date.now();
}

/**
 * Ensure cache is loaded (lazy load).
 */
async function ensureCacheLoaded() {
    if (cachedData !== null) return cachedData;
    return await loadDatabaseFromDisk();
}

/* =================== Public API =================== */

/**
 * Read value from cache for given oamPath.
 * Reads served from memory (fast). If cache is empty, it will be loaded first.
 *
 * @param {String} oamPath
 * @returns {Promise<any>}
 */
exports.readFromDatabaseAsync = async function (oamPath) {
    const coreModelJsonObject = await ensureCacheLoaded();
    // path resolution is synchronous and fast (operates on in-memory object)
    const pathList = oamPath.split('/');
    try {
        // use defensive traversal (same semantics as original)
        return getAttributeValueFromDataBase(JSON.parse(JSON.stringify(coreModelJsonObject)), pathList);
    } catch (err) {
        // normalize NotFound
        if (err instanceof createHttpError.HttpError) throw err;
        throw new createHttpError.NotFound('UUID not found');
    }
};

/**
 * Write to cache and persist to disk.
 * Serializes writes using AsyncLock on the databasePath.
 *
 * @param {String} oamPath
 * @param {JSON|String} valueToBeUpdated
 * @param {Boolean} isAList
 * @returns {Promise<Boolean>}
 */
exports.writeToDatabaseAsync = async function (oamPath, valueToBeUpdated, isAList) {
    // normalize value as original code did
    if (isAList !== true && typeof valueToBeUpdated !== 'string') {
        for (let keyAttributeOfTheList in valueToBeUpdated) {
            valueToBeUpdated = valueToBeUpdated[keyAttributeOfTheList];
        }
    }

    // acquire write lock so multiple writes don't interleave
    return await lock.acquire('write', async () => {
        const coreModelJsonObject = await ensureCacheLoaded();

        const pathList = oamPath.split('/');
        const result = putAttributeValueToDataBase(coreModelJsonObject, pathList, valueToBeUpdated, isAList);

        if (result) {
            try {
                await persistCacheToDisk(coreModelJsonObject);
                // after successful persist, ensure watcher is active
                if (!watcher) startFileWatcher();
                return true;
            } catch (err) {
                console.error(`[JSON-Driver] Failed to persist DB to disk: ${err.message}`);
                // return false or throw? Keep behavior similar to prior: return false
                return false;
            }
        } else {
            return false;
        }
    });
};

/**
 * Delete from cache and persist to disk.
 *
 * @param {String} oamPath
 * @returns {Promise<Boolean>}
 */
exports.deletefromDatabaseAsync = async function (oamPath) {
    return await lock.acquire('write', async () => {
        const coreModelJsonObject = await ensureCacheLoaded();
        const pathList = oamPath.split('/');
        const result = deleteAttributeValueFromDataBase(coreModelJsonObject, pathList);
        if (result) {
            try {
                await persistCacheToDisk(coreModelJsonObject);
                if (!watcher) startFileWatcher();
                return true;
            } catch (err) {
                console.error(`[JSON-Driver] Failed to persist DB to disk after delete: ${err.message}`);
                return false;
            }
        } else {
            return false;
        }
    });
};

/* ============ Core traversal and mutators (same semantics as original) ============ */

/**
 * Defensive traversal: ensures lists/fields exist before iterating/accessing.
 */
function getAttributeValueFromDataBase(coreModelJsonObject, pathList) {
    try {
        let current = coreModelJsonObject;
        for (let field of pathList) {
            if (field !== '') {
                if (field.includes('=')) {
                    if (!current || typeof current !== 'object') {
                        throw new createHttpError.NotFound(`List context not found for ${field}`);
                    }
                    current = findMatchingInstanceFromList(field, current);
                    if (Array.isArray(current)) throw new Error('UUID not found');
                } else {
                    if (!current || typeof current !== 'object' || !(field in current)) {
                        throw new createHttpError.NotFound(`Path ${field} not found`);
                    }
                    current = current[field];
                }
            }
        }
        return current;
    } catch (error) {
        if (error instanceof createHttpError.HttpError) throw error;
        console.log(error);
        throw new createHttpError.NotFound('UUID not found');
    }
}

/**
 * Put (update) value in JSON object following onf path.
 */
function putAttributeValueToDataBase(coreModelJsonObject, pathList, newValue, isAList) {
    try {
        let temp = coreModelJsonObject;
        for (let i = 0; i < pathList.length; i++) {
            const field = pathList[i];
            if (field !== '') {
                if (field.includes('=')) {
                    if (!temp || typeof temp !== 'object') return false;
                    temp = findMatchingInstanceFromList(field, temp);
                } else {
                    if (i === pathList.length - 1) {
                        if (isAList === true) {
                            if (!temp || typeof temp !== 'object') return false;
                            const listRef = temp[field];
                            if (Array.isArray(listRef)) {
                                listRef.push(newValue);
                            } else {
                                return false;
                            }
                        } else {
                            if (!temp || typeof temp !== 'object') return false;
                            if (Object.prototype.hasOwnProperty.call(temp, field)) {
                                temp[field] = newValue;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        if (!temp || typeof temp !== 'object') return false;
                        temp = temp[field];
                    }
                }
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Delete an attribute or list element.
 */
function deleteAttributeValueFromDataBase(coreModelJsonObject, pathList) {
    try {
        let temp = coreModelJsonObject;
        for (let i = 0; i < pathList.length; i++) {
            const field = pathList[i];
            if (field !== '') {
                if (field.includes('=')) {
                    if (i === pathList.length - 1) {
                        temp = findMatchingInstanceAndDeleteFromList(field, temp);
                    } else {
                        temp = findMatchingInstanceFromList(field, temp);
                    }
                } else {
                    if (i === pathList.length - 1) {
                        if (Array.isArray(temp[field])) {
                            temp[field] = [];
                        } else {
                            temp[field] = undefined;
                        }
                    } else {
                        temp = temp[field];
                    }
                }
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Find list element by primary key mapping.
 */
function findMatchingInstanceFromList(field, obj) {
    try {
        const [listName, value] = field.split('=');
        if (!obj || typeof obj !== 'object') {
            throw new createHttpError.NotFound(`Context object missing for ${listName}`);
        }
        const key = primaryKey.keyAttributeOfList[listName];
        if (!key) {
            throw new createHttpError.NotFound(`Key attribute mapping not found for list ${listName}`);
        }
        const list = obj[listName];
        if (!Array.isArray(list)) {
            throw new createHttpError.NotFound(`List ${listName} not found`);
        }
        for (let item of list) {
            if (item && typeof item === 'object' && item[key] == value) {
                return item;
            }
        }
        throw new createHttpError.NotFound(`UUID ${value} not found in ${listName}`);
    } catch (error) {
        if (error instanceof createHttpError.HttpError) throw error;
        console.log(error);
        console.log(field);
        throw new createHttpError.NotFound(`UUID not found for ${field}`);
    }
}

/**
 * Remove matched element from list.
 */
function findMatchingInstanceAndDeleteFromList(field, obj) {
    const [listName, value] = field.split('=');
    const key = primaryKey.keyAttributeOfList[listName];
    if (!key) {
        throw new createHttpError.NotFound(`Key attribute mapping not found for list ${listName}`);
    }
    const list = obj[listName];
    if (!Array.isArray(list)) {
        throw new createHttpError.NotFound(`List ${listName} not found`);
    }
    const index = list.findIndex((element) => element && element[key] == value);
    if (index >= 0) {
        list.splice(index, 1);
    } else {
        throw new createHttpError.NotFound(`UUID ${value} not found in ${listName}`);
    }
    return obj;
}

/* ========== Optional helpers ========== */

/**
 * Force reload cache from disk (for admin/debug usage).
 */
exports.reloadCacheNow = async function () {
    return await lock.acquire('admin-reload', async () => {
        return await loadDatabaseFromDisk();
    });
};

/**
 * Return cache stats (for health checks / logging)
 */
exports.cacheStats = function () {
    return {
        loaded: cachedData !== null,
        cacheTimestamp,
        path: global.databasePath
    };
};
