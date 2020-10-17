"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("../document");
class PendingDataPorts extends document_1.default {
    constructor() {
        super("pending-exports-document");
        this.allPending = new Array();
    }
    /** @inheritdoc */
    loadRecord(record) {
        this.allPending = record.pendingExports || [];
        return super.loadRecord(record);
    }
    toRecord() {
        this.record.pendingExports = this.allPending;
        return super.toRecord();
    }
}
exports.default = PendingDataPorts;
//# sourceMappingURL=pending-data-ports.js.map