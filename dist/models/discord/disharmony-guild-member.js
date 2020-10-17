"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../commands/command");
const document_1 = require("../document");
class DisharmonyGuildMember extends document_1.default {
    constructor(djs) {
        super(djs.id);
        this.djs = djs;
    }
    get permissions() { return this.djs.permissions; }
    get nickname() { return this.djs.nickname; }
    get username() { return this.djs.user.username; }
    addRole(snowflake, reason) { return this.djs.addRole(snowflake, reason); }
    removeRole(snowflake, reason) { return this.djs.removeRole(snowflake, reason); }
    getPermissionLevel() {
        if (this.id === "117966411548196870")
            return command_1.PermissionLevel.HostOwner;
        else if (this.permissions.has("ADMINISTRATOR"))
            return command_1.PermissionLevel.Admin;
        else
            return command_1.PermissionLevel.Anyone;
    }
    toString() { return this.djs.toString(); }
}
exports.default = DisharmonyGuildMember;
//# sourceMappingURL=disharmony-guild-member.js.map