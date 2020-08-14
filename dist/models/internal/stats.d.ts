import { Client as DjsClient } from "discord.js";
export default class Stats {
    private dClient;
    readonly guildCount: number;
    readonly userCount: number;
    readonly uptime: number;
    readonly uptimeStr: string;
    private toHHMMSS;
    constructor(dClient: DjsClient);
}
