import { Collection } from "mongodb";
import { MongoClientConfig } from "../models/internal/config";
import { CriticalError, DbClient } from "./db-client";
export default class MongoClient implements DbClient {
    private onCriticalError;
    private mongoClientConfig;
    private connectionPromise;
    private reconnectFailTimeout;
    private connectionString;
    private client;
    private db;
    isMongo: boolean;
    readonly isReconnecting: boolean;
    updateOne(collectionName: string, query: any, update: any): Promise<void>;
    insertOne(collectionName: string, record: any): Promise<void>;
    findOne(collectionName: string, query: any): Promise<any>;
    deleteOne(collectionName: string, query: any): Promise<void>;
    replaceOne(collectionName: string, query: any, record: any): Promise<void>;
    getCollection(collectionName: string): Promise<Collection>;
    closeConnection(): Promise<void>;
    private connectDb;
    private onClose;
    private onReconnect;
    constructor(connectionString: string, onCriticalError: (err: CriticalError) => void, mongoClientConfig?: MongoClientConfig);
}
