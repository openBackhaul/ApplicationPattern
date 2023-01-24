import { OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import { LoggingOptions } from './logging.options'
import { SwaggerUiOptions } from './swagger.ui.options';
import * as express from 'express';

export class Oas3AppOptions {
    public routing: any;
    public openApiValidator: OpenApiValidatorOpts;
    public logging: LoggingOptions;
    public swaggerUI: SwaggerUiOptions;
    public app: express.Application;
   	public cors: any;

    constructor(routingOpts: any, openApiValidatorOpts: OpenApiValidatorOpts, logging: LoggingOptions, swaggerUI: SwaggerUiOptions, app: express.Application, cors: any) {

        this.routing = routingOpts;
        this.openApiValidator = openApiValidatorOpts;
        this.swaggerUI = swaggerUI;
        if (!logging)
            logging = new LoggingOptions(null, null);
        this.logging = logging;
        this.app = app;
    		this.cors = cors;
    }
}