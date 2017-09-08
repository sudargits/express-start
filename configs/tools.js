/**
 * Created by rakhmatullahyoga on 06/07/17.
 */

'use strict';

module.exports = function (MODULES, CONSTANTS, callback) {
    let async = MODULES.ASYNC;

    async.waterfall([
        function(callback) {
            console.time('Loading app tools and database');
            // Define parameter for initialization
            let TOOLS = {};

            // Initialize application logger
            let logOpts = {
                transports: [
                    new (MODULES.WINSTON.transports.Console)({colorize: true}),
                    new (MODULES.WINSTON.transports.File)({
                        filename: CONSTANTS.PATH.LOG_DEFAULT_PATH,
                        handleExceptions: true,
                        colorize: true
                    })
                ],
                exceptionHandlers: [
                    new (MODULES.WINSTON.transports.Console)({colorize: true}),
                    new (MODULES.WINSTON.transports.File)({
                        filename: CONSTANTS.PATH.LOG_EXCEPTIONS_PATH,
                        handleExceptions: true,
                        colorize: true
                    })
                ]
            };
            TOOLS.LOG = new (MODULES.WINSTON.Logger)(logOpts);

            // Initialize multipart/form-data handler
            TOOLS.MULTER = MODULES.MULTER();

            // Initialize models (Sequelize)
            TOOLS.MODELS = require(CONSTANTS.PATH.MODELS_LOADER)(MODULES);

            // Initialize mongoose (Mongoose)
            require(CONSTANTS.PATH.SCHEMA_LOADER)(MODULES);

            // Initialize Redis database
            TOOLS.REDIS_CLIENT = require(CONSTANTS.PATH.REDIS_CLIENT)(MODULES);

            console.timeEnd('Loading app tools and database');

            callback(null, TOOLS);
        },
        function (TOOLS, callback) {
            console.time('Loading services, controllers and interfaces');
            // Initialize services
            TOOLS.SERVICES = require(CONSTANTS.PATH.CLASS_LOADER)(TOOLS, MODULES, CONSTANTS.PATH.SERVICES_PATH);

            // Initialize interfaces
            TOOLS.CONTROLLERS = require(CONSTANTS.PATH.CLASS_LOADER)(TOOLS, MODULES, CONSTANTS.PATH.CONTROLLERS_PATH);

            // Initialize interfaces
            TOOLS.INTERFACES = {};

            // Packaging constants and modules
            TOOLS.CONSTANTS = CONSTANTS;
            TOOLS.MODULES = MODULES;
            console.timeEnd('Loading services, controllers and interfaces');
            callback(null, TOOLS);
        }
    ], function (err, result) {
        if(err) {
            throw err;
        } else {
            callback(null, result);
        }
    });
};