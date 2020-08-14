export declare abstract class FriendlyError extends Error {
    friendlyMessage: string;
    constructor(message: string, friendlyMessage?: string | boolean);
}
