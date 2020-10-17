import * as Joi from "@hapi/joi";
import Config from "../models/internal/config";
export default function <TConfig extends Config>(schema?: Joi.ObjectSchema, configPath?: string): TConfig;
export declare function isConfigValid(config: Config, secondarySchema?: Joi.ObjectSchema): boolean;
export declare function isDbLocal(connectionString: string): boolean;
