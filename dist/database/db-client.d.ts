import { MongoClientConfig, NedbClientConfig } from "../models/internal/config";
export default function getDbClient(connectionString: string, onCriticalError: (err: CriticalError) => void, clientConfig?: MongoClientConfig | NedbClientConfig): DbClient;
export interface DbClient {
    updateOne(collectionName: string, query: any, update: any): Promise<void>;
    insertOne(collectionName: string, record: any, allowBuffering?: boolean): Promise<void>;
    findOne(collectionName: string, query: any, allowBuffering?: boolean): Promise<any>;
    deleteOne(collectionName: string, query: any, allowBuffering?: boolean): Promise<void>;
    replaceOne(collectionName: string, query: any, record: any): Promise<void>;
    closeConnection(): Promise<void>;
    isMongo: boolean;
    isReconnecting: boolean;
}
export declare enum CriticalError {
    ReconnectFail = "Reconnect failure"
}
