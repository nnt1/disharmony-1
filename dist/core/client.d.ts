import { Channel as DjsChannel, GuildMember as DjsGuildMember, Message as DjsMessage } from "discord.js";
import { ISimpleEvent, SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";
import { DisharmonyGuild } from "..";
import Command from "../commands/command";
import DisharmonyGuildMember from "../models/discord/disharmony-guild-member";
import DisharmonyMessage from "../models/discord/disharmony-message";
import Config from "../models/internal/config";
import Stats from "../models/internal/stats";
import LiteDisharmonyClient, { LiteClient } from "./lite-client";
export interface Client extends LiteClient {
    readonly commands: Command[];
    readonly channels: Map<string, DjsChannel>;
    readonly onMessage: ISimpleEvent<DisharmonyMessage>;
    stats: Stats;
}
declare type MessageConstructor<TMessage extends DisharmonyMessage> = new (djsMessage: DjsMessage) => TMessage;
export default class DisharmonyClient<TMessage extends DisharmonyMessage = DisharmonyMessage, _TGuild extends DisharmonyGuild = DisharmonyGuild, TGuildMember extends DisharmonyGuildMember = DisharmonyGuildMember, TConfig extends Config = Config> extends LiteDisharmonyClient implements Client {
    config: TConfig;
    messageCtor: MessageConstructor<TMessage>;
    guildMemberCtor: new (djsGuildMember: DjsGuildMember) => TGuildMember;
    private intervalManager;
    readonly onBeforeLogin: SignalDispatcher;
    readonly onReady: SignalDispatcher;
    readonly onMessage: SimpleEventDispatcher<TMessage>;
    readonly onVoiceStateUpdate: SimpleEventDispatcher<{
        oldMember: TGuildMember;
        newMember: TGuildMember;
    }>;
    commands: Command[];
    stats: Stats;
    readonly channels: Map<string, DjsChannel>;
    login(token: string): Promise<void>;
    destroy(): Promise<void>;
    dispatchMessage(message: TMessage): void;
    private dispatchVoiceStateUpdateIfPermitted;
    constructor(commands: Command[], config: TConfig, messageCtor?: MessageConstructor<TMessage>, guildMemberCtor?: new (djsGuildMember: DjsGuildMember) => TGuildMember);
}
export {};
