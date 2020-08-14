"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friendly_error_1 = require("../core/friendly-error");
class DocumentError extends friendly_error_1.FriendlyError {
    constructor(reason) {
        super(DocumentError.getFriendlyMessage(reason), true);
        this.reason = reason;
        Object.setPrototypeOf(this, DocumentError.prototype);
    }
    static getFriendlyMessage(reason) {
        switch (reason) {
            case DocumentErrorReason.DatabaseCommandThrew:
                return "Database command failed, if this error persists the host owner should check their console for errors.";
            case DocumentErrorReason.DatabaseReconnecting:
                return "Database unexpectedly disconnected! Attempting reconnect, please try again shortly.";
        }
    }
}
exports.DocumentError = DocumentError;
var DocumentErrorReason;
(function (DocumentErrorReason) {
    DocumentErrorReason[DocumentErrorReason["DatabaseCommandThrew"] = 0] = "DatabaseCommandThrew";
    DocumentErrorReason[DocumentErrorReason["DatabaseReconnecting"] = 1] = "DatabaseReconnecting";
})(DocumentErrorReason = exports.DocumentErrorReason || (exports.DocumentErrorReason = {}));
//# sourceMappingURL=document-error.js.map