import { Client as DjsClient } from "discord.js";
import { DbClient } from "../database/db-client";
import DjsExtensionModel from "../models/discord/djs-extension-model";
import Config from "../models/internal/config";
export interface LiteClient extends DjsExtensionModel<DjsClient> {
    readonly botId: string;
    readonly dbClient: DbClient;
    readonly config: Config;
    login(token: string): Promise<void>;
}
export default class LiteDisharmonyClient implements LiteClient {
    config: Config;
    djs: DjsClient;
    readonly botId: string;
    readonly dbClient: DbClient;
    login(token: string): Promise<void>;
    destroy(): Promise<void>;
    private onDebug;
    private onCriticalDbError;
    constructor(config: Config);
}
