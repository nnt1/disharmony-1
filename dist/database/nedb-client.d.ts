import { NedbClientConfig } from "../models/internal/config";
import { DbClient } from "./db-client";
export default class NedbClient implements DbClient {
    private nedbClientConfig;
    private writeCount;
    private baseDir;
    private collections;
    isMongo: boolean;
    isReconnecting: boolean;
    updateOne(collectionName: string, query: any, update: any): Promise<void>;
    insertOne(collectionName: string, record: any): Promise<void>;
    findOne(collectionName: string, query: any): Promise<any>;
    deleteOne(collectionName: string, query: any): Promise<void>;
    replaceOne(collectionName: string, query: any, record: any): Promise<void>;
    closeConnection(): Promise<void>;
    private getCollection;
    private incrementWriteCount;
    constructor(connectionString: string, nedbClientConfig?: NedbClientConfig);
}
