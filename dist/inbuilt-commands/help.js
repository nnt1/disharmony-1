"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = require("../commands/command");
async function invoke(_, message, client) {
    await message.reply(createHelpEmbed(client, message.guild.me, message.member));
}
function createHelpEmbed(client, me, member) {
    const embed = new discord_js_1.RichEmbed().setTitle(`__${client.config.serviceName} help__`);
    const displayableCommands = client.commands
        .filter(x => x.permissionLevel <= member.getPermissionLevel()) // Show only commands available to this user
        .filter(x => !x.hidden) // Don't show hidden commands
        .sort((a, b) => a.syntax <= b.syntax ? 0 : 1); // Sort commands alphabetically by syntax
    for (const command of displayableCommands)
        embed.addField(command.syntax.match(/^\s?[^\s]+/)[0], `${command.description}
            **Usage:** *@${me.nickname || me.username} ${command.syntax}*
            ${command.permissionLevel !== command_1.PermissionLevel.Anyone ? `***${command_1.PermissionLevel[command.permissionLevel]} only***` : ""}`);
    embed.addField("__Need more help?__", "[Visit my website](https://benji7425.github.io) or [Join my Discord](https://discord.gg/SSkbwSJ)");
    return embed;
}
exports.default = new command_1.default(
/*syntax*/ "help", 
/*description*/ "Display available commands with descriptions", 
/*permissionLevel*/ command_1.PermissionLevel.Anyone, 
/*invoke*/ invoke);
//# sourceMappingURL=help.js.map