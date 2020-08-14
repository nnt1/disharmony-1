"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const event_strings_1 = require("../utilities/logging/event-strings");
const document_error_1 = require("./document-error");
const serializable_1 = require("./serializable");
class Document extends serializable_1.default {
    constructor(id, dbCollectionName) {
        super();
        this.id = id;
        /** Whether this Document represents a brand new Database record */
        this.isNewRecord = false;
        /** Collection of fields to be included in the next database $set operation */
        this.updateFields = {};
        this.dbCollectionName = dbCollectionName || this.constructor.name;
    }
    /** Save record modifications back to the database, or insert the record for the first time */
    async save() {
        this.record._id = this.id;
        /* Invoking toRecord here will execute any record writes that derived
           classes may implement in their toRecord function, in case they need
           to be included in the update $set operator */
        const record = this.toRecord();
        this.throwIfReconnecting();
        try {
            if (this.isNewRecord)
                await Document.dbClient.insertOne(this.dbCollectionName, record);
            else if (Object.keys(this.updateFields).length > 0)
                await Document.dbClient.updateOne(this.dbCollectionName, { _id: this.id }, { $set: this.updateFields });
            else
                await Document.dbClient.replaceOne(this.dbCollectionName, { _id: this.id }, record);
            this.updateFields = {};
            this.isNewRecord = false;
        }
        catch (e) {
            await __1.Logger.consoleLogError(`Error inserting or updating document for guild ${this.id}`, e);
            await __1.Logger.logEvent(event_strings_1.EventStrings.DocumentUpdateError, { id: this.id });
            throw new document_error_1.DocumentError(document_error_1.DocumentErrorReason.DatabaseCommandThrew);
        }
    }
    /** Delete the corresponding database record */
    async deleteRecord() {
        this.throwIfReconnecting();
        try {
            await Document.dbClient.deleteOne(this.dbCollectionName, { _id: this.id });
        }
        catch (e) {
            await __1.Logger.consoleLogError(`Error deleting record for guild ${this.id}`, e);
            await __1.Logger.logEvent(event_strings_1.EventStrings.DocumentDeleteError, { id: this.id });
            throw new document_error_1.DocumentError(document_error_1.DocumentErrorReason.DatabaseCommandThrew);
        }
    }
    /** Load the corresponding document from the database (based off this document's .id) */
    async loadDocument() {
        this.throwIfReconnecting();
        try {
            const record = await Document.dbClient.findOne(this.dbCollectionName, { _id: this.id });
            const recordProxy = new Proxy(record || {}, {
                get: (target, prop) => target[prop],
                set: (target, prop, value) => {
                    target[prop] = value;
                    if (typeof prop === "string" && prop !== "id" && prop !== "_id")
                        this.addSetOperator(prop, value);
                    return true;
                },
            });
            this.isNewRecord = !record;
            this.loadRecord(recordProxy);
            if (this.isNewRecord)
                await this.save();
        }
        catch (e) {
            await __1.Logger.consoleLogError(`Error loading document for guild ${this.id}`, e);
            await __1.Logger.logEvent(event_strings_1.EventStrings.DocumentLoadError, { id: this.id });
            throw new document_error_1.DocumentError(document_error_1.DocumentErrorReason.DatabaseCommandThrew);
        }
    }
    /** Throw an error if the database client is currently reconnecting */
    throwIfReconnecting() {
        if (Document.dbClient.isReconnecting)
            throw new document_error_1.DocumentError(document_error_1.DocumentErrorReason.DatabaseReconnecting);
    }
    /** Add a field to the $set operator used in the next update */
    addSetOperator(field, value) {
        this.updateFields[field] = value;
    }
    toRecord() { return this.record; }
    loadRecord(record) { this.record = record; }
}
exports.default = Document;
//# sourceMappingURL=document.js.map