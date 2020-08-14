"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore = require("nedb-core");
const path_1 = require("path");
const typed_promisify_1 = require("typed-promisify");
const logger_1 = require("../utilities/logging/logger");
class NedbClient {
    constructor(connectionString, nedbClientConfig = { compactionWriteCount: 100 }) {
        this.nedbClientConfig = nedbClientConfig;
        this.writeCount = 0;
        this.collections = new Array();
        this.isMongo = false;
        this.isReconnecting = false;
        this.baseDir = /^nedb:\/\/(.+)/.exec(connectionString)[1];
    }
    async updateOne(collectionName, query, update) {
        const collection = this.getCollection(collectionName);
        await typed_promisify_1.promisify(collection.update, collection)(query, update, {});
        this.incrementWriteCount();
    }
    async insertOne(collectionName, record) {
        const collection = this.getCollection(collectionName);
        await typed_promisify_1.promisify(collection.insert, collection)(record);
        this.incrementWriteCount();
    }
    async findOne(collectionName, query) {
        const collection = this.getCollection(collectionName);
        return typed_promisify_1.promisify(collection.findOne, collection)(query);
    }
    async deleteOne(collectionName, query) {
        const collection = this.getCollection(collectionName);
        await typed_promisify_1.promisify(collection.remove, collection)(query);
    }
    async replaceOne(collectionName, query, record) {
        return this.updateOne(collectionName, query, record);
    }
    closeConnection() {
        return Promise.resolve();
    }
    getCollection(name) {
        const filename = path_1.join(this.baseDir, name);
        let collection = this.collections.find(x => x.filename === filename);
        if (!collection) {
            collection = new Datastore({ filename, autoload: true });
            this.collections.push(collection);
        }
        return collection;
    }
    incrementWriteCount() {
        this.writeCount++;
        if (this.writeCount > this.nedbClientConfig.compactionWriteCount) {
            for (const collection of this.collections)
                collection.persistence.compactDatafile();
            this.writeCount = 0;
            logger_1.default.debugLog("Compacted NeDB collections");
        }
    }
}
exports.default = NedbClient;
//# sourceMappingURL=nedb-client.js.map