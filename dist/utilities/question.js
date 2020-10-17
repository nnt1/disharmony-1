"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const event_strings_1 = require("./logging/event-strings");
class Question {
    constructor(client, channelID, query, askee, pingAskee = false) {
        this.client = client;
        this.channelID = channelID;
        this.query = query;
        this.askee = askee;
        this.pingAskee = pingAskee;
        this.queryStr = query;
        if (this.askee && this.pingAskee)
            this.queryStr = `${this.askee.toString()} ` + this.queryStr;
        this.channel = this.client.channels.get(this.channelID);
    }
    async send() {
        return new Promise(async (resolve, reject) => {
            let timeout;
            let resolver;
            resolver = msg => {
                if (!this.askee || msg.member.id === this.askee.id) {
                    if (timeout)
                        clearTimeout(timeout);
                    this.client.onMessage.unsub(resolver);
                    resolve(msg);
                }
            };
            const timeoutRejecter = () => {
                this.client.onMessage.unsub(resolver);
                reject(QuestionRejectionReason.ResponseTimeout);
            };
            timeout = setTimeout(timeoutRejecter, this.client.config.askTimeoutMs || 3000);
            this.client.onMessage.sub(resolver);
            try {
                await this.channel.send(this.queryStr);
            }
            catch (e) {
                if (timeout)
                    clearTimeout(timeout);
                this.client.onMessage.unsub(resolver);
                await __1.Logger.debugLogError(`Failed to send question to channel ${this.channelID}`, e);
                await __1.Logger.logEvent(event_strings_1.EventStrings.MessageSendError);
                reject(QuestionRejectionReason.ChannelSendError);
            }
        });
    }
}
exports.default = Question;
var QuestionRejectionReason;
(function (QuestionRejectionReason) {
    QuestionRejectionReason[QuestionRejectionReason["ResponseTimeout"] = 0] = "ResponseTimeout";
    QuestionRejectionReason[QuestionRejectionReason["ChannelSendError"] = 1] = "ChannelSendError";
})(QuestionRejectionReason = exports.QuestionRejectionReason || (exports.QuestionRejectionReason = {}));
//# sourceMappingURL=question.js.map