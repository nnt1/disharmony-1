import { Client, DisharmonyGuildMember, DisharmonyMessage } from "..";
export default class Question {
    private client;
    readonly channelID: string;
    readonly query: string;
    readonly askee?: DisharmonyGuildMember | undefined;
    readonly pingAskee: boolean;
    private queryStr;
    private channel;
    send(): Promise<DisharmonyMessage>;
    constructor(client: Client, channelID: string, query: string, askee?: DisharmonyGuildMember | undefined, pingAskee?: boolean);
}
export declare enum QuestionRejectionReason {
    ResponseTimeout = 0,
    ChannelSendError = 1
}
