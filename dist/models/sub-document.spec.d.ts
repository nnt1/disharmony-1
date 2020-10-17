import { IMock } from "typemoq";
import { DbClient } from "../database/db-client";
export declare class SubDocumentTestFixture {
    dbClient: IMock<DbClient>;
    setup(): void;
    array_proxy_returns_class_instance_from_record_array_item(): void;
    parent_document_updates_db_when_array_item_set(): void;
    same_instance_returned_when_repeat_access(): void;
    error_thrown_when_setting_index_and_parent_pending_field_write(): void;
}
