export declare class HandleMessageTestFixture {
    private client;
    private djsMessage;
    private setMessageMember;
    setup(): void;
    doesnt_reply_or_dispatch_when_message_from_self(): Promise<void>;
    dispatches_when_non_command_message(): Promise<void>;
    replies_and_dispatches_when_command_in_message(): Promise<void>;
    replies_and_dispatches_when_command_throws_friendly_error(): Promise<void>;
    replies_and_dispatches_when_guild_missing_permission(): Promise<void>;
    doesnt_invoke_command_when_guild_missing_permissions(): Promise<void>;
}
