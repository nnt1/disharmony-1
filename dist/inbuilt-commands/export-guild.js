"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("..");
const pending_data_ports_1 = require("../models/internal/pending-data-ports");
async function invoke(_, message) {
    const pendingList = new pending_data_ports_1.default();
    await pendingList.loadDocument();
    const guildId = message.guild.id;
    const memberId = message.member.id;
    if (pendingList.allPending.find(x => x.guildId === guildId && x.memberId === memberId))
        return "You already have a pending import or export for this server, please wait for it to complete before trying again.";
    if (!message.guild.hasPermissions(discord_js_1.Permissions.FLAGS.ATTACH_FILES))
        return "Please grant the bot permission to attach files and try again.";
    pendingList.allPending.push({
        guildId,
        memberId,
        channelId: message.channelId,
        isImport: false,
    });
    await pendingList.save();
    return "Your export will be generated in the background within a few minutes and will be uploaded to this channel.";
}
exports.default = new __1.Command(
/*syntax*/ "export", 
/*description*/ "Export data from this guild in JSON format", 
/*permissionLevel*/ __1.PermissionLevel.Admin, 
/*invoke*/ invoke);
//# sourceMappingURL=export-guild.js.map