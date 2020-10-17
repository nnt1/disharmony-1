"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const alsatian_1 = require("alsatian");
const typemoq_1 = require("typemoq");
const command_1 = require("./command");
const command_error_1 = require("./command-error");
const command_parser_1 = require("./command-parser");
let CommandParserTestFixture = class CommandParserTestFixture {
    async setup() {
        // Don't actually pass types into mocks as I don't want constructors being invoked
        const command = {};
        command.syntax = "valid";
        command.permissionLevel = command_1.PermissionLevel.Anyone;
        this.command = command;
        const client = {};
        client.botId = "botid";
        client.commands = [this.command];
        this.client = client;
        this.guild = typemoq_1.Mock.ofType();
        this.guild.setup(x => x.commandPrefix)
            .returns(() => null);
        this.member = typemoq_1.Mock.ofType();
        this.member.setup(x => x.getPermissionLevel())
            .returns(() => command_1.PermissionLevel.Anyone);
        this.message = typemoq_1.Mock.ofType();
        this.message.setup(x => x.guild)
            .returns(() => this.guild.object);
        this.message.setup(x => x.member)
            .returns(() => this.member.object);
    }
    async null_invoker_when_no_command_syntax_in_message() {
        // ARRANGE
        this.message.setup(x => x.content)
            .returns(() => "just a normal chat message");
        // ACT
        const invoker = await command_parser_1.default(this.client, this.message.object);
        // ASSERT
        alsatian_1.Expect(invoker).toBeNull();
    }
    async null_invoker_when_non_existant_command_in_message() {
        // ARRANGE
        this.message.setup(x => x.content)
            .returns(() => "<@botid> invalidcommand");
        // ACT
        const invoker = await command_parser_1.default(this.client, this.message.object);
        // ASSERT
        alsatian_1.Expect(invoker).toBeNull();
    }
    async missing_permission_thrown_when_user_permission_level_too_low() {
        // ARRANGE
        this.command.permissionLevel = command_1.PermissionLevel.Admin;
        this.message.setup(x => x.content)
            .returns(() => "<@botid> valid");
        // ACT
        let error;
        await command_parser_1.default(this.client, this.message.object).catch(reason => error = reason);
        // ASSERT
        alsatian_1.Expect(error.reason).toBe(command_error_1.CommandErrorReason.UserMissingPermissions);
    }
    async incorrect_syntax_thrown_when_syntax_incorrect() {
        // ARRANGE
        this.command.syntax = "valid param1 param2";
        this.message.setup(x => x.content)
            .returns(() => "<@botid> valid");
        // ACT
        let error;
        await command_parser_1.default(this.client, this.message.object).catch(reason => error = reason);
        // ASSERT
        alsatian_1.Expect(error.reason).toBe(command_error_1.CommandErrorReason.IncorrectSyntax);
    }
    async returns_working_command_invoker_when_valid_command_in_message() {
        // ARRANGE
        this.command.invoke = async () => "invoked";
        this.message.setup(x => x.content)
            .returns(() => "<@botid> valid");
        // ACT
        const invoker = await command_parser_1.default(this.client, this.message.object);
        const result = await invoker(this.client, this.message.object);
        // ASSERT
        alsatian_1.Expect(result).toBe("invoked");
    }
    async error_rethrown_when_invoked_command_throws() {
        // ARRANGE
        this.command.invoke = async () => { throw new Error("its borked"); };
        this.message.setup(x => x.content)
            .returns(() => "<@botid> valid");
        // ACT
        const invoker = await command_parser_1.default(this.client, this.message.object);
        // ASSERT
        await alsatian_1.Expect(async () => await invoker(this.client, this.message.object)).toThrowAsync();
    }
    async command_recognised_when_guild_has_command_prefix() {
        // ARRANGE
        this.guild = typemoq_1.Mock.ofType();
        this.guild.setup(x => x.commandPrefix)
            .returns(() => "!");
        this.message.setup(x => x.guild)
            .returns(() => this.guild.object);
        this.message.setup(x => x.content)
            .returns(() => "!valid");
        // ACT
        const invoker = await command_parser_1.default(this.client, this.message.object);
        // ASSERT
        alsatian_1.Expect(invoker).toBeDefined();
    }
};
__decorate([
    alsatian_1.Setup
], CommandParserTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "null_invoker_when_no_command_syntax_in_message", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "null_invoker_when_non_existant_command_in_message", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "missing_permission_thrown_when_user_permission_level_too_low", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "incorrect_syntax_thrown_when_syntax_incorrect", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "returns_working_command_invoker_when_valid_command_in_message", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "error_rethrown_when_invoked_command_throws", null);
__decorate([
    alsatian_1.AsyncTest()
], CommandParserTestFixture.prototype, "command_recognised_when_guild_has_command_prefix", null);
CommandParserTestFixture = __decorate([
    alsatian_1.TestFixture("Command parsing")
], CommandParserTestFixture);
exports.CommandParserTestFixture = CommandParserTestFixture;
//# sourceMappingURL=command-parser.spec.js.map