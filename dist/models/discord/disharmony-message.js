"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disharmony_guild_1 = require("./disharmony-guild");
const disharmony_guild_member_1 = require("./disharmony-guild-member");
class DisharmonyMessage {
    constructor(djs) {
        this.djs = djs;
        this.guild = new disharmony_guild_1.default(this.djs.guild);
        this.member = new disharmony_guild_member_1.default(this.djs.member);
    }
    get content() { return this.djs.content; }
    get channelId() { return this.djs.channel.id; }
    get mentions() { return this.djs.mentions; }
    async reply(response) {
        await this.djs.reply(response);
    }
}
exports.default = DisharmonyMessage;
//# sourceMappingURL=disharmony-message.js.map