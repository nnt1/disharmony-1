import { FriendlyError } from "../core/friendly-error";
export declare class CommandError extends FriendlyError {
    reason: CommandErrorReason;
    private static getFriendlyMessage;
    constructor(reason: CommandErrorReason);
}
export declare enum CommandErrorReason {
    UserMissingPermissions = 0,
    BotMissingGuildPermissions = 1,
    IncorrectSyntax = 2
}
