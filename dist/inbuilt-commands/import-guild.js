"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const pending_data_ports_1 = require("../models/internal/pending-data-ports");
async function invoke(_, message) {
    if (message.djs.attachments.size === 0)
        return "Please issue the command again with your JSON data file attached.";
    const pendingList = new pending_data_ports_1.default();
    await pendingList.loadDocument();
    const guildId = message.guild.id;
    const memberId = message.member.id;
    if (pendingList.allPending.find(x => x.guildId === guildId))
        return "You already have a pending import or export for this server, please wait for it to complete before trying again.";
    pendingList.allPending.push({
        guildId,
        memberId,
        channelId: message.channelId,
        isImport: true,
        url: message.djs.attachments.first().url,
    });
    await pendingList.save();
    return "Your import will be processed in the background within a few minutes and you will receive a confirmation message in this channel.";
}
exports.default = new __1.Command(
/*syntax*/ "import", 
/*description*/ "Import data for this guild from JSON", 
/*permissionLevel*/ __1.PermissionLevel.Admin, 
/*invoke*/ invoke);
//# sourceMappingURL=import-guild.js.map