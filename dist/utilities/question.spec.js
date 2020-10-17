"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const alsatian_1 = require("alsatian");
const ste_simple_events_1 = require("ste-simple-events");
const typemoq_1 = require("typemoq");
const question_1 = require("./question");
let QuestionTestFixture = class QuestionTestFixture {
    setup() {
        this.messageDispatcher = new ste_simple_events_1.SimpleEventDispatcher();
        this.channelMock = typemoq_1.Mock.ofType();
        this.channelMock
            .setup(x => x.send(typemoq_1.It.isAny()))
            .returns(() => Promise.resolve());
        this.clientMock = typemoq_1.Mock.ofType();
        this.clientMock
            .setup(x => x.onMessage)
            .returns(() => this.messageDispatcher);
        this.clientMock
            .setup(x => x.channels)
            .returns(() => new Map([["channelid", this.channelMock.object]]));
        this.askeeMock = typemoq_1.Mock.ofType();
        this.askeeMock
            .setup(x => x.toString())
            .returns(() => "<askee-id>");
        this.askeeMock
            .setup(x => x.id)
            .returns(() => "askee-id");
        this.responseMock = typemoq_1.Mock.ofType();
        /* Fixes issue where promises resolving with this never finish,
           as the engine iteratively looks for .then until it's undefined */
        this.responseMock.setup(x => x.then).returns(() => undefined);
    }
    query_string_sent_to_channel() {
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query");
        // tslint:disable-next-line: no-floating-promises
        sut.send();
        // ASSERT
        this.channelMock.verify(x => x.send(typemoq_1.It.isValue("query")), typemoq_1.Times.once());
    }
    query_string_prefixed_with_askee_mention_if_askee_provided_and_ping_askee_true() {
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query", this.askeeMock.object, true);
        // tslint:disable-next-line: no-floating-promises
        sut.send();
        // ASSERT
        this.channelMock.verify(x => x.send(typemoq_1.It.isValue("<askee-id> query")), typemoq_1.Times.once());
    }
    async resolves_with_answer_when_response_within_timeout() {
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query");
        const responsePromise = sut.send();
        this.messageDispatcher.dispatch(this.responseMock.object);
        const response = await responsePromise;
        // ASSERT
        alsatian_1.Expect(response).toBe(this.responseMock.object);
    }
    async resolves_with_answer_when_askee_provided_and_askee_responds() {
        // ARRANGE
        this.responseMock
            .setup(x => x.member)
            .returns(() => this.askeeMock.object);
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query", this.askeeMock.object);
        const responsePromise = sut.send();
        this.messageDispatcher.dispatch(this.responseMock.object);
        const response = await responsePromise;
        // ASSERT
        alsatian_1.Expect(response).toBe(this.responseMock.object);
    }
    async does_not_resolve_when_askee_provided_and_other_member_responds() {
        // ARRANGE
        const otherMemberMock = typemoq_1.Mock.ofType();
        otherMemberMock
            .setup(x => x.id)
            .returns(() => "other-id");
        this.responseMock
            .setup(x => x.member)
            .returns(() => otherMemberMock.object);
        let isResolved = false;
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query", this.askeeMock.object);
        // tslint:disable-next-line: no-floating-promises
        sut.send().then(() => isResolved = true);
        this.messageDispatcher.dispatch(this.responseMock.object);
        // ASSERT
        // Allow the .send() promise to resolve, if it is going to (otherwise we Expect() too early, and always pass)
        await new Promise(resolve => setImmediate(resolve));
        alsatian_1.Expect(isResolved).toBe(false);
    }
    async still_resolves_with_answer_when_askee_provided_and_other_member_responds_before_askee_does() {
        // ARRANGE
        const otherMemberMock = typemoq_1.Mock.ofType();
        otherMemberMock
            .setup(x => x.id)
            .returns(() => "other-id");
        const otherMemberResponseMock = typemoq_1.Mock.ofType();
        otherMemberResponseMock.setup(x => x.then).returns(() => undefined);
        otherMemberResponseMock
            .setup(x => x.member)
            .returns(() => otherMemberMock.object);
        this.responseMock
            .setup(x => x.member)
            .returns(() => this.askeeMock.object);
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query", this.askeeMock.object);
        const responsePromise = sut.send();
        this.messageDispatcher.dispatch(otherMemberResponseMock.object);
        await new Promise(resolve => setImmediate(resolve));
        this.messageDispatcher.dispatch(this.responseMock.object);
        await new Promise(resolve => setImmediate(resolve));
        const response = await responsePromise;
        // ASSERT
        alsatian_1.Expect(response).toBe(this.responseMock.object);
    }
    async rejects_with_response_timeout_reason_when_response_not_within_timeout() {
        // ARRANGE
        this.clientMock
            .setup(x => x.config)
            .returns(() => ({ askTimeoutMs: 250 }));
        let rejectionValue = null;
        // ACT
        const sut = new question_1.default(this.clientMock.object, "channelid", "query");
        const responsePromise = sut.send();
        await new Promise(resolve => setTimeout(resolve, 250));
        await responsePromise.catch(err => rejectionValue = err);
        // ASSERT
        alsatian_1.Expect(rejectionValue).toBe(question_1.QuestionRejectionReason.ResponseTimeout);
    }
};
__decorate([
    alsatian_1.Setup
], QuestionTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.Test()
], QuestionTestFixture.prototype, "query_string_sent_to_channel", null);
__decorate([
    alsatian_1.Test()
], QuestionTestFixture.prototype, "query_string_prefixed_with_askee_mention_if_askee_provided_and_ping_askee_true", null);
__decorate([
    alsatian_1.AsyncTest()
], QuestionTestFixture.prototype, "resolves_with_answer_when_response_within_timeout", null);
__decorate([
    alsatian_1.AsyncTest()
], QuestionTestFixture.prototype, "resolves_with_answer_when_askee_provided_and_askee_responds", null);
__decorate([
    alsatian_1.AsyncTest()
], QuestionTestFixture.prototype, "does_not_resolve_when_askee_provided_and_other_member_responds", null);
__decorate([
    alsatian_1.AsyncTest()
], QuestionTestFixture.prototype, "still_resolves_with_answer_when_askee_provided_and_other_member_responds_before_askee_does", null);
__decorate([
    alsatian_1.AsyncTest()
], QuestionTestFixture.prototype, "rejects_with_response_timeout_reason_when_response_not_within_timeout", null);
QuestionTestFixture = __decorate([
    alsatian_1.TestFixture("Question")
], QuestionTestFixture);
exports.QuestionTestFixture = QuestionTestFixture;
//# sourceMappingURL=question.spec.js.map