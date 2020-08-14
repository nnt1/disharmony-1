"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const command_1 = require("../commands/command");
const event_strings_1 = require("../utilities/logging/event-strings");
const question_1 = require("../utilities/question");
async function invoke(_, message, client) {
    return new Promise(async (__, reject) => {
        const response = await new question_1.default(client, message.channelId, "Are you sure you want to delete all the data for this server? (yes/no)", message.member, true).send();
        if (response.content.toLowerCase() === "yes") {
            await message.guild.deleteRecord();
            __1.Logger.logEvent(event_strings_1.EventStrings.GuildReset, { guildId: message.guild.id });
            /* This is a very hacky way of doing this, but when using resolve
               the Guild object gets saved back to the database straight away,
               meaning it'd be deleted and instnantly re-created. Using reject
               means that save doesn't get called by the parent. Very hacky but works. */
            reject(new __1.CommandRejection("Data for this server successfully deleted"));
        }
        else
            reject(new __1.CommandRejection("Data was not deleted"));
    });
}
exports.default = new command_1.default(
/*syntax*/ "reset", 
/*description*/ "Reset all data for this Discord server. WARNING: YOU WILL LOSE ALL YOUR SETTINGS!", 
/*permissionLevel*/ command_1.PermissionLevel.Admin, 
/*invoke*/ invoke);
//# sourceMappingURL=reset.js.map