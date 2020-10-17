import { FriendlyError } from "../core/friendly-error";
export declare class DocumentError extends FriendlyError {
    reason: DocumentErrorReason;
    private static getFriendlyMessage;
    constructor(reason: DocumentErrorReason);
}
export declare enum DocumentErrorReason {
    DatabaseCommandThrew = 0,
    DatabaseReconnecting = 1
}
