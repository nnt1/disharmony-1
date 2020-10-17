"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["Anyone"] = 0] = "Anyone";
    PermissionLevel[PermissionLevel["Admin"] = 1] = "Admin";
    PermissionLevel[PermissionLevel["HostOwner"] = 2] = "HostOwner";
})(PermissionLevel = exports.PermissionLevel || (exports.PermissionLevel = {}));
class Command {
    constructor(syntax, description, permissionLevel, invoke, hidden = false) {
        this.syntax = syntax;
        this.description = description;
        this.permissionLevel = permissionLevel;
        this.invoke = invoke;
        this.hidden = hidden;
    }
}
exports.default = Command;
//# sourceMappingURL=command.js.map