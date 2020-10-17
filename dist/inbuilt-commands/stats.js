"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../commands/command");
function invoke(_, __, client) {
    return Promise.resolve(`
        **Server count:** ${client.stats.guildCount}
        **Cached users:** ${client.stats.userCount}
        **Uptime:** ${client.stats.uptimeStr}
        `);
}
exports.default = new command_1.default(
/*syntax*/ "stats", 
/*description*/ "Returns some stats about the bot", 
/*permissionLevel*/ command_1.PermissionLevel.Anyone, 
/*invoke*/ invoke);
//# sourceMappingURL=stats.js.map