"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const __1 = require("..");
const event_strings_1 = require("../utilities/logging/event-strings");
const db_client_1 = require("./db-client");
class MongoClient {
    constructor(connectionString, onCriticalError, mongoClientConfig = { reconnectInterval: 1000, reconnectTries: 30 }) {
        this.onCriticalError = onCriticalError;
        this.mongoClientConfig = mongoClientConfig;
        this.isMongo = true;
        this.connectionString = connectionString;
        this.connectionPromise = this.connectDb().catch(err => { throw new Error("Failed to connect to database" + err ? err.message || err : ""); });
    }
    get isReconnecting() { return !!this.reconnectFailTimeout; }
    async updateOne(collectionName, query, update) {
        await (await this.getCollection(collectionName))
            .updateOne(query, update);
    }
    async insertOne(collectionName, record) {
        await (await this.getCollection(collectionName))
            .insertOne(record);
    }
    async findOne(collectionName, query) {
        return (await this.getCollection(collectionName))
            .findOne(query);
    }
    async deleteOne(collectionName, query) {
        await (await this.getCollection(collectionName))
            .deleteOne(query);
    }
    async replaceOne(collectionName, query, record) {
        await (await this.getCollection(collectionName))
            .replaceOne(query, record);
    }
    async getCollection(collectionName) {
        await this.connectionPromise;
        return this.db.collection(collectionName);
    }
    closeConnection() {
        return this.client.close();
    }
    async connectDb() {
        /* Don't buffer entries during downtime as if the database is down we will present a "try again soon"
           message to the user. It would be confusing if their change then did actually go through. */
        this.client = await mongodb_1.MongoClient.connect(this.connectionString, {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: this.mongoClientConfig.reconnectTries,
            reconnectInterval: this.mongoClientConfig.reconnectInterval,
            bufferMaxEntries: 0,
        });
        this.db = this.client.db();
        this.db.on("close", this.onClose.bind(this));
        this.db.on("reconnect", this.onReconnect.bind(this));
    }
    onClose(err) {
        __1.Logger.consoleLogError(`MongoDB connection lost`, err);
        __1.Logger.logEvent(event_strings_1.EventStrings.DbConnectionLost, { protocol: "MongoDB" });
        const onReconnectFail = () => this.onCriticalError(db_client_1.CriticalError.ReconnectFail);
        this.reconnectFailTimeout = setTimeout(onReconnectFail, this.mongoClientConfig.reconnectInterval * this.mongoClientConfig.reconnectTries);
    }
    onReconnect() {
        __1.Logger.logEvent(event_strings_1.EventStrings.DbReconnected, { protocol: "MongoDB" });
        if (this.reconnectFailTimeout)
            clearTimeout(this.reconnectFailTimeout);
        this.reconnectFailTimeout = null;
    }
}
exports.default = MongoClient;
//# sourceMappingURL=mongo-client.js.map