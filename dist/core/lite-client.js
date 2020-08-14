"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("..");
const db_client_1 = require("../database/db-client");
const document_1 = require("../models/document");
const exit_codes_1 = require("../utilities/exit-codes");
class LiteDisharmonyClient {
    constructor(config) {
        this.config = config;
        this.djs = new discord_js_1.Client({
            messageCacheMaxSize: 16,
            disabledEvents: ["TYPING_START"],
        });
        document_1.default.dbClient = db_client_1.default(config.dbConnectionString, this.onCriticalDbError, config.dbClientConfig);
        Error.stackTraceLimit = Infinity;
        this.djs.on("error", (err) => __1.Logger.debugLogError("Websocket error from discord.js", err.error));
        this.djs.on("debug", this.onDebug);
        process.on("uncaughtException", async (err) => {
            await __1.Logger.consoleLogError("Unhandled exception!", err);
            process.exit(exit_codes_1.ExitCodes.UnhandledException);
        });
        process.on("exit", code => __1.Logger.consoleLog("Shutdown with code " + code));
        process.on("SIGINT", () => {
            this.dbClient.closeConnection()
                .then(() => process.exit(0))
                .catch(() => process.exit(exit_codes_1.ExitCodes.DatabaseCloseError));
        });
    }
    get botId() { return /[0-9]{18}/.exec(this.djs.user.toString())[0]; }
    get dbClient() { return document_1.default.dbClient; }
    async login(token) {
        // Remove newlines from token, sometimes text editors put newlines at the start/end but this causes problems for discord.js' login
        await this.djs.login(token.replace(/\r?\n|\r/g, ""));
        __1.Logger.consoleLog(`Registered bot ${this.djs.user.username}`);
        __1.Logger.consoleLog(`You can view detailed logs in the logs/ directory`);
    }
    async destroy() {
        await this.djs.destroy();
    }
    onDebug(msg) {
        msg = msg.replace(/Authenticated using token [^ ]+/, "Authenticated using token [redacted]");
        if (!/[Hh]eartbeat/.exec(msg)) // Ignore regular heartbeat messages that would bloat the log file
            __1.Logger.debugLog(msg);
    }
    onCriticalDbError(error) {
        __1.Logger.consoleLogError(`Critical database error, shutting down: ${error.toString()}`)
            .catch().then(() => process.exit(exit_codes_1.ExitCodes.CriticalDatabaseError)).catch();
    }
}
exports.default = LiteDisharmonyClient;
//# sourceMappingURL=lite-client.js.map