'use strict';


/**
 * Add a new pet to the store
 *
 * body Pet Pet object that needs to be added to the store
 * no response value expected for this operation
 **/
exports.addPet = function(body) {
    return new Promise(function(resolve, reject) {
        resolve();
    });
};

/**
 * Finds Pets by status
 * Multiple status values can be provided with comma separated strings
 *
 * status List Status values that need to be considered for filter
 * sessionid String  (optional)
 * returns List
 **/
exports.findPetsByStatus = function(status,sessionid) {
    return new Promise(function(resolve, reject) {
        var examples = {};
        examples['application/json'] = [{
            'photoUrls': [ 'photoUrls', 'photoUrls' ],
            'name' : 'doggie',
            'id' : 0,
            'category' : {
                'name' : 'name',
                'id' : 6
            },
            'tags' : [ {
                'name' : 'name',
                'id' : 1
            }, {
                'name' : 'name',
                'id' : 1
            } ],
            'status' : 'available'
        } ];
        if (Object.keys(examples).length > 0) {
            resolve(examples[Object.keys(examples)[0]]);
        } else {
            resolve();
        }
    });
};

/**
 * Find pet by ID
 * Returns a single pet
 *
 * petId Long ID of pet to return
 * returns Pet
 **/
exports.getPetById = function(petId) {

    return new Promise(function(resolve, reject) {
        var examples = {};
        examples['application/json'] = {
            'photoUrls' : [ 'photoUrls', 'photoUrls' ],
            'name' : 'doggie',
            'id' : 0,
            'category' : {
                'name' : 'name',
                'id' : 6
            },
            'tags' : [ {
                'name' : 'name',
                'id' : 1
            }, {
                'name' : 'name',
                'id' : 1
            } ],
            'status' : 'available'
        };
        if (Object.keys(examples).length > 0) {
            resolve(examples[Object.keys(examples)[0]]);
        } else {
            resolve();
        }
    });
};

