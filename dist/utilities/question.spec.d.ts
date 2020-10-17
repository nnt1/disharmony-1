export declare class QuestionTestFixture {
    private messageDispatcher;
    private channelMock;
    private clientMock;
    private askeeMock;
    private responseMock;
    setup(): void;
    query_string_sent_to_channel(): void;
    query_string_prefixed_with_askee_mention_if_askee_provided_and_ping_askee_true(): void;
    resolves_with_answer_when_response_within_timeout(): Promise<void>;
    resolves_with_answer_when_askee_provided_and_askee_responds(): Promise<void>;
    does_not_resolve_when_askee_provided_and_other_member_responds(): Promise<void>;
    still_resolves_with_answer_when_askee_provided_and_other_member_responds_before_askee_does(): Promise<void>;
    rejects_with_response_timeout_reason_when_response_not_within_timeout(): Promise<void>;
}
