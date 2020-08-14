"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FriendlyError extends Error {
    constructor(message, friendlyMessage = false) {
        super(message);
        if (friendlyMessage === true)
            this.friendlyMessage = message;
        else if (typeof friendlyMessage === "string")
            this.friendlyMessage = friendlyMessage;
        // See https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, FriendlyError.prototype);
    }
}
exports.FriendlyError = FriendlyError;
//# sourceMappingURL=friendly-error.js.map