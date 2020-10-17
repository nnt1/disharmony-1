"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const event_strings_1 = require("../utilities/logging/event-strings");
const command_error_1 = require("./command-error");
const command_rejection_1 = require("./command-rejection");
async function getCommandInvoker(client, message) {
    let details;
    let command;
    try {
        details = getCommandDetails(message, client);
        if (!details)
            return null;
        command = client.commands.find(x => x.syntax.startsWith(details.name));
        if (!command)
            return null;
    }
    catch (err) {
        /* Suppress any errors that occur while we're not yet sure if this is a command.
           This is important because of the high volume of messages the bot receives, if something
           goes wrong with message parsing we don't want it to reply "an error occurred" to
           every single message it sees! */
        await __1.Logger.debugLogError(`Error determining if message contained command`, err);
        await __1.Logger.logEvent(event_strings_1.EventStrings.DetermineCommandError);
        return null;
    }
    if (!isUserPermitted(message, command))
        throw new command_error_1.CommandError(command_error_1.CommandErrorReason.UserMissingPermissions);
    else if (details.params.length < (command.syntax.match(/\s[^\s\[]+/g) || []).length)
        throw new command_error_1.CommandError(command_error_1.CommandErrorReason.IncorrectSyntax);
    else
        return async (invokeClient, invokeMessage) => {
            await invokeMessage.guild.loadDocument();
            let out;
            try {
                out = await command.invoke(details.params, invokeMessage, invokeClient);
            }
            catch (e) {
                if (e instanceof command_rejection_1.default)
                    out = e.message;
                else
                    throw e;
            }
            await invokeMessage.guild.save();
            return out;
        };
}
exports.default = getCommandInvoker;
function isUserPermitted(message, command) {
    return message.member.getPermissionLevel() >= command.permissionLevel;
}
function getCommandDetails(message, client) {
    // If no command prefix exists for this guild command criteria is bot mention
    const commandPrefix = message.guild.commandPrefix || `^<@!?${client.botId}>`;
    const regexp = new RegExp(`${commandPrefix}\\s+([^\\s]+)(?:\\s+(.*))?`);
    const result = regexp.exec(message.content);
    return !result ? null :
        {
            name: result[1],
            params: result[2] ? result[2].split(/\s+/) : [],
        };
}
//# sourceMappingURL=command-parser.js.map