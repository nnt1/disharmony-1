"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimpleFileWriter = require("simple-file-writer");
class FileEventLogger {
    logEvent(action, parameters) {
        const logStr = JSON.stringify({ ts: new Date().getTime(), action, parameters }) + "\n";
        return new Promise(resolve => this.logWriter.write(logStr, resolve));
    }
    constructor(path) {
        this.logWriter = new SimpleFileWriter(path);
    }
}
exports.default = FileEventLogger;
//# sourceMappingURL=file-event-logger.js.map