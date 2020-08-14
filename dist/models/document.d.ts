import { DbClient } from "../database/db-client";
import Serializable from "./serializable";
export default abstract class Document extends Serializable {
    id: string;
    /** Whether this Document represents a brand new Database record */
    protected isNewRecord: boolean;
    /** Name of the database collection to use when saving/loading this document */
    private dbCollectionName;
    /** Collection of fields to be included in the next database $set operation */
    updateFields: any;
    /** Reference to the IDbClient to use for Document save/load operations */
    static dbClient: DbClient;
    /** Save record modifications back to the database, or insert the record for the first time */
    save(): Promise<void>;
    /** Delete the corresponding database record */
    deleteRecord(): Promise<void>;
    /** Load the corresponding document from the database (based off this document's .id) */
    loadDocument(): Promise<void>;
    /** Throw an error if the database client is currently reconnecting */
    private throwIfReconnecting;
    /** Add a field to the $set operator used in the next update */
    addSetOperator(field: string, value: any): void;
    toRecord(): any;
    loadRecord(record: any): void;
    constructor(id: string, dbCollectionName?: string);
}
