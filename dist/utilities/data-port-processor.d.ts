import { PendingDataPort } from "../models/internal/pending-data-ports";
import WorkerAction from "./worker-action";
export default class DataPortProcessor extends WorkerAction {
    /** @override */
    invoke(): Promise<void>;
    processDataPortForPendingEntry(pendingPort: PendingDataPort): Promise<void>;
    private processImport;
    private processExport;
}
