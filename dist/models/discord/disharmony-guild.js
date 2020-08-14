"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("../document");
const disharmony_guild_member_1 = require("./disharmony-guild-member");
class DisharmonyGuild extends document_1.default {
    constructor(djs) {
        super(djs.id, "Guild");
        this.djs = djs;
        this.me = new disharmony_guild_member_1.default(djs.me);
    }
    get name() { return this.djs.name; }
    get commandPrefix() { return this.record.commandPrefix; }
    /** @deprecated Use `botHasPermissions` instead */
    get hasPermissions() { return this.botHasPermissions; }
    botHasPermissions(permissions) {
        return this.djs.me.permissions.missing(permissions).length === 0;
    }
    getExportJson() {
        return JSON.stringify(this.record);
    }
}
exports.default = DisharmonyGuild;
//# sourceMappingURL=disharmony-guild.js.map