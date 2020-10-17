"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const command_error_1 = require("../commands/command-error");
const command_parser_1 = require("../commands/command-parser");
const event_strings_1 = require("../utilities/logging/event-strings");
async function handleMessage(client, djsMessage, innerGetCommandInvoker) {
    // Sometimes message member is null, no idea why
    if (!djsMessage.member)
        return;
    // Ignore messages from self
    if (djsMessage.member.id === djsMessage.member.guild.me.id)
        return;
    const message = new client.messageCtor(djsMessage);
    try {
        const commandInvoker = await (innerGetCommandInvoker ? innerGetCommandInvoker(client, message) : command_parser_1.default(client, message));
        if (commandInvoker) {
            if (!message.guild.botHasPermissions(client.config.requiredPermissions))
                throw new command_error_1.CommandError(command_error_1.CommandErrorReason.BotMissingGuildPermissions);
            const result = await commandInvoker(client, message);
            if (result)
                await message.reply(result);
        }
    }
    catch (err) {
        await __1.Logger.debugLogError(`Error invoking command in guild ${message.guild.id}`, err);
        if (err && err.reason === command_error_1.CommandErrorReason.BotMissingGuildPermissions)
            await __1.Logger.logEvent(event_strings_1.EventStrings.MissingGuildPermissions, { guildId: message.guild.id });
        else
            await __1.Logger.logEvent(event_strings_1.EventStrings.InvokeCommandError, { guildId: message.guild.id });
        await message.reply(err.friendlyMessage || "An unknown error occurred.");
    }
    client.dispatchMessage(message);
}
exports.default = handleMessage;
//# sourceMappingURL=handle-message.js.map