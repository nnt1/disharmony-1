"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friendly_error_1 = require("../core/friendly-error");
class CommandError extends friendly_error_1.FriendlyError {
    constructor(reason) {
        super(CommandError.getFriendlyMessage(reason), true);
        this.reason = reason;
        Object.setPrototypeOf(this, CommandError.prototype);
    }
    static getFriendlyMessage(reason) {
        switch (reason) {
            case CommandErrorReason.UserMissingPermissions:
                return "You do not have permission to use this command";
            case CommandErrorReason.IncorrectSyntax:
                return "Incorrect syntax! See correct syntax with the `help` command";
            case CommandErrorReason.BotMissingGuildPermissions:
                return "The bot has not been granted the necessary permissions in this server. Please grant the permissions and try again. Details can be found in the readme you used to invite the bot.";
        }
    }
}
exports.CommandError = CommandError;
var CommandErrorReason;
(function (CommandErrorReason) {
    CommandErrorReason[CommandErrorReason["UserMissingPermissions"] = 0] = "UserMissingPermissions";
    CommandErrorReason[CommandErrorReason["BotMissingGuildPermissions"] = 1] = "BotMissingGuildPermissions";
    CommandErrorReason[CommandErrorReason["IncorrectSyntax"] = 2] = "IncorrectSyntax";
})(CommandErrorReason = exports.CommandErrorReason || (exports.CommandErrorReason = {}));
//# sourceMappingURL=command-error.js.map