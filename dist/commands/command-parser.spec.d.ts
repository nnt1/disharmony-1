export declare class CommandParserTestFixture {
    private command;
    private client;
    private guild;
    private member;
    private message;
    setup(): Promise<void>;
    null_invoker_when_no_command_syntax_in_message(): Promise<void>;
    null_invoker_when_non_existant_command_in_message(): Promise<void>;
    missing_permission_thrown_when_user_permission_level_too_low(): Promise<void>;
    incorrect_syntax_thrown_when_syntax_incorrect(): Promise<void>;
    returns_working_command_invoker_when_valid_command_in_message(): Promise<void>;
    error_rethrown_when_invoked_command_throws(): Promise<void>;
    command_recognised_when_guild_has_command_prefix(): Promise<void>;
}
