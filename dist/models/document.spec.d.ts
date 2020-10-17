import { IMock } from "typemoq";
import { DbClient } from "../database/db-client";
export declare class DocumentTestFixture {
    dbClient: IMock<DbClient>;
    setup(): void;
    db_client_receives_insert_when_load_document_called_for_new_record(): Promise<void>;
    db_client_receives_insert_when_new_serializable_saved(): void;
    db_client_receives_update_when_serializable_updated_and_saved(): Promise<void>;
    db_client_receives_replace_when_neither_update_nor_insert_valid(): Promise<void>;
    db_client_in_ready_state_when_save_complete(): Promise<void>;
    serializable_record_set_to_db_value_when_serializable_loads_record(): Promise<void>;
    load_document_throws_if_error_returned_when_serializable_loads_record(): Promise<void>;
}
