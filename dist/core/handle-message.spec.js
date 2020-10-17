"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-floating-promises
const alsatian_1 = require("alsatian");
const typemoq_1 = require("typemoq");
const command_error_1 = require("../commands/command-error");
const handle_message_1 = require("./handle-message");
let HandleMessageTestFixture = class HandleMessageTestFixture {
    setMessageMember(memberId) {
        this.djsMessage = typemoq_1.Mock.ofType();
        this.djsMessage.setup(x => x.member)
            .returns(() => {
            return {
                id: memberId,
                guild: { me: { id: "bot-id" }, commandPrefix: null },
            };
        });
        this.djsMessage.setup(x => x.guild)
            .returns(() => {
            return {
                id: "guild-id",
                commandPrefix: null,
            };
        });
    }
    setup() {
        this.client = typemoq_1.Mock.ofType();
        this.client.setup(x => x.botId)
            .returns(() => "bot-id");
        this.setMessageMember("member-id");
    }
    async doesnt_reply_or_dispatch_when_message_from_self() {
        // ARRANGE
        this.setMessageMember("bot-id");
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object);
        // ASSERT
        this.djsMessage.verify(x => x.reply(typemoq_1.It.isAny()), typemoq_1.Times.never());
        this.client.verify(x => x.dispatchMessage(typemoq_1.It.isAny()), typemoq_1.Times.never());
    }
    async dispatches_when_non_command_message() {
        // ARRANGE
        this.djsMessage.setup(x => x.content)
            .returns(() => "just an ordinary chat message");
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object);
        // ASSERT
        this.client.verify(x => x.dispatchMessage(typemoq_1.It.isAny()), typemoq_1.Times.once());
    }
    async replies_and_dispatches_when_command_in_message() {
        // ARRANGE
        const self = this;
        class Message {
            constructor() {
                this.guild = { botHasPermissions: (_) => true };
            }
            reply(msg) { self.djsMessage.object.reply(msg); }
        }
        this.client.setup(x => x.messageCtor)
            .returns(() => Message);
        const getCommandInvokerFunc = () => Promise.resolve(() => Promise.resolve("result"));
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object, getCommandInvokerFunc);
        // ASSERT
        this.djsMessage.verify(x => x.reply("result"), typemoq_1.Times.once());
        this.client.verify(x => x.dispatchMessage(typemoq_1.It.isAny()), typemoq_1.Times.once());
    }
    async replies_and_dispatches_when_command_throws_friendly_error() {
        // ARRANGE
        const self = this;
        class Message {
            constructor() {
                this.guild = { hasPermissions: (_) => true };
            }
            reply(msg) { self.djsMessage.object.reply(msg); }
        }
        this.client.setup(x => x.messageCtor)
            .returns(() => Message);
        const getCommandInvokerFunc = () => Promise.resolve(() => { throw new command_error_1.CommandError(command_error_1.CommandErrorReason.UserMissingPermissions); });
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object, getCommandInvokerFunc);
        // ASSERT
        this.djsMessage.verify(x => x.reply(typemoq_1.It.isAnyString()), typemoq_1.Times.once());
        this.client.verify(x => x.dispatchMessage(typemoq_1.It.isAny()), typemoq_1.Times.once());
    }
    async replies_and_dispatches_when_guild_missing_permission() {
        // ARRANGE
        const self = this;
        class Message {
            constructor() {
                this.guild = { hasPermissions: (_) => false };
            }
            reply(msg) { self.djsMessage.object.reply(msg); }
        }
        this.client.setup(x => x.messageCtor)
            .returns(() => Message);
        const getCommandInvokerFunc = () => Promise.resolve(() => Promise.resolve("result"));
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object, getCommandInvokerFunc);
        // ASSERT
        this.djsMessage.verify(x => x.reply(typemoq_1.It.isAnyString()), typemoq_1.Times.once());
        this.client.verify(x => x.dispatchMessage(typemoq_1.It.isAny()), typemoq_1.Times.once());
    }
    async doesnt_invoke_command_when_guild_missing_permissions() {
        // ARRANGE
        const self = this;
        class Message {
            constructor() {
                this.guild = { hasPermissions: (_) => false };
            }
            reply(msg) { self.djsMessage.object.reply(msg); }
        }
        this.client.setup(x => x.messageCtor)
            .returns(() => Message);
        let commandInvoked = false;
        const getCommandInvokerFunc = () => Promise.resolve(() => {
            commandInvoked = true;
            Promise.resolve("result");
        });
        // ACT
        await handle_message_1.default(this.client.object, this.djsMessage.object, getCommandInvokerFunc);
        // ASSERT
        alsatian_1.Expect(commandInvoked).toBe(false);
    }
};
__decorate([
    alsatian_1.Setup
], HandleMessageTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "doesnt_reply_or_dispatch_when_message_from_self", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "dispatches_when_non_command_message", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "replies_and_dispatches_when_command_in_message", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "replies_and_dispatches_when_command_throws_friendly_error", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "replies_and_dispatches_when_guild_missing_permission", null);
__decorate([
    alsatian_1.AsyncTest()
], HandleMessageTestFixture.prototype, "doesnt_invoke_command_when_guild_missing_permissions", null);
HandleMessageTestFixture = __decorate([
    alsatian_1.TestFixture("Message handling")
], HandleMessageTestFixture);
exports.HandleMessageTestFixture = HandleMessageTestFixture;
//# sourceMappingURL=handle-message.spec.js.map