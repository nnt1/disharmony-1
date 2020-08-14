"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-console
const Joi = require("@hapi/joi");
const fs_1 = require("fs");
const path_1 = require("path");
const exit_codes_1 = require("./exit-codes");
function default_1(schema, configPath = "./config.json") {
    let config = null;
    configPath = path_1.resolve(configPath);
    if (fs_1.existsSync(configPath))
        config = require(path_1.resolve(process.cwd(), configPath));
    else {
        console.error("No config file found!");
        process.exit(exit_codes_1.ExitCodes.ConfigLoadError);
    }
    if (process.env.TOKEN)
        config.token = process.env.TOKEN;
    if (process.env.DB_STRING)
        config.dbConnectionString = process.env.DB_STRING;
    if (!isConfigValid(config, schema)) {
        console.error("Invalid config!");
        process.exit(exit_codes_1.ExitCodes.ConfigLoadError);
    }
    config.computedValues = {
        isLocalDb: isDbLocal(config.dbConnectionString),
        configPath,
    };
    return config;
}
exports.default = default_1;
function isConfigValid(config, secondarySchema) {
    // See config.ts for a typed interface
    const primarySchema = Joi.object().keys({
        dbConnectionString: Joi.string().required(),
        token: Joi.string().required(),
        serviceName: Joi.string().required(),
        requiredPermissions: Joi.number().required(),
        askTimeoutMs: Joi.number().required(),
        heartbeat: Joi.object().optional().keys({
            url: Joi.string().required(),
            intervalSec: Joi.number().required(),
        }),
        dbClientConfig: Joi.object().optional(),
        memoryMeasureIntervalSec: Joi.number().optional(),
        playingStatusString: Joi.string().optional(),
        computedValues: Joi.object().invalid(),
    });
    const validationOptions = { allowUnknown: true };
    const primarySchemaError = !!Joi.validate(config, primarySchema, validationOptions).error;
    let secondarySchemaError = false;
    if (secondarySchema)
        secondarySchemaError = !!Joi.validate(config, secondarySchema, validationOptions).error;
    return !primarySchemaError && !secondarySchemaError;
}
exports.isConfigValid = isConfigValid;
function isDbLocal(connectionString) {
    return connectionString.startsWith("nedb://");
}
exports.isDbLocal = isDbLocal;
//# sourceMappingURL=load-configuration.js.map