import Document from "../document";
export declare type PendingDataPort = {
    guildId: string;
    memberId: string;
    isImport: boolean;
    channelId: string;
    url?: string;
};
export default class PendingDataPorts extends Document {
    allPending: PendingDataPort[];
    /** @inheritdoc */
    loadRecord(record: any): void;
    toRecord(): any;
    constructor();
}
