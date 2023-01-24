'use strict';

import { defaults } from 'lodash';
import * as fs from 'fs';
import * as parseurl from 'parseurl';
import * as path  from 'path';
import * as serveStatic from 'serve-static';
import { SwaggerUiOptions } from './swagger.ui.options';

import Debug from "debug";
const debug = Debug("oas3-tools:ui");

export class SwaggerUI {

  private readonly definition: any;
  private readonly options: SwaggerUiOptions;

  private apiDocsCache: object = {};
  private apiDocsPaths = [];

  constructor(definition, options: SwaggerUiOptions) {
    this.definition = definition;
    // Set the defaults
    this.options = defaults(options || {}, this.getDefaultOptions());

    this.configurePaths();
  }

  public serveStaticContent() {
    const options: SwaggerUiOptions = this.options;
    const apiDocsPaths = this.apiDocsPaths;
    const apiDocsCache = this.apiDocsCache;

    const staticMiddleware = serveStatic(options.swaggerUiDir, {});

    return (req, res, next) => {
      const path = parseurl(req).pathname;
      const isApiDocsPath = apiDocsPaths.indexOf(path) > -1 || (path === options.apiDocsPath);
      const isSwaggerUiPath = path === options.swaggerUIPath || path.indexOf(options.swaggerUIPath + '/') === 0;
      var swaggerApiDocsURL;
      // Start with the original path
      swaggerApiDocsURL = parseurl.original(req).pathname;

      // Remove the part after the mount point
      swaggerApiDocsURL = swaggerApiDocsURL.substring(0, swaggerApiDocsURL.indexOf(req.url));

      // Add the API docs path and remove any double dashes
      swaggerApiDocsURL = (swaggerApiDocsURL + options.apiDocsPath).replace(/\/\//g, '/');

      debug('%s %s', req.method, req.url);
      debug('  Will process: %s', isApiDocsPath || isSwaggerUiPath ? 'yes' : 'no');

      if (isApiDocsPath) {
        debug('  Serving API Docs');

        res.setHeader('Content-Type', 'application/json');

        return res.end(apiDocsCache[path]);
      } else if (isSwaggerUiPath) {
        debug('  Serving swagger-ui');

        res.setHeader('Swagger-API-Docs-URL', swaggerApiDocsURL);

        if (path === options.swaggerUIPath || path === options.swaggerUIPath + '/') {
          req.url = '/';
        } else {
          req.url = req.url.substring(options.swaggerUIPath.length);
        }

        return staticMiddleware(req, res, next);
      }
      return next();
    };
  }

  private configurePaths() {
    const swaggerUiDir: string = this.options.swaggerUiDir ? path.resolve(this.options.swaggerUiDir) : path.join(__dirname, 'swagger-ui');

    if (this.options.swaggerUiDir) {
    } else {
      this.options.swaggerUiDir = swaggerUiDir;
    }

    if (!fs.existsSync(swaggerUiDir)) {
      throw new Error('options.swaggerUiDir path does not exist: ' + swaggerUiDir);
    } else if (!fs.statSync(swaggerUiDir).isDirectory()) {
      throw new Error('options.swaggerUiDir path is not a directory: ' + swaggerUiDir);
    }

    debug('  Using swagger-ui from: %s', this.options.swaggerUiDir ? swaggerUiDir : 'internal');
    debug('  API Docs path: %s', this.options.apiDocsPath);

    // Add the Resource Listing or SwaggerObject to the response cache
    this.apiDocsCache[this.options.apiDocsPath] = JSON.stringify(this.definition, null, 2);

    this.apiDocsPaths = Object.keys(this.apiDocsCache);
  }

  private getDefaultOptions(): SwaggerUiOptions {
    return new SwaggerUiOptions('/api-docs', '/docs', undefined);
  }
}
