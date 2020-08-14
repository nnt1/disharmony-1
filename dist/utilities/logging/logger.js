"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const SimpleFileWriter = require("simple-file-writer");
const file_event_logger_1 = require("./file-event-logger");
const logsDir = path_1.join(process.cwd(), "logs");
if (!fs_1.existsSync(logsDir))
    fs_1.mkdirSync(logsDir);
const consoleLogWriter = new SimpleFileWriter(path_1.join(logsDir, "console.log"));
const debugLogWriter = new SimpleFileWriter(path_1.join(logsDir, "debug.log"));
const eventLogger = new file_event_logger_1.default(path_1.join(logsDir, "event.log"));
function logMessage(message, writeToConsole, prefix, error) {
    const messageStr = [`[${process.pid}] [${new Date().toUTCString()}]`, prefix, message].join(" ");
    let consoleStr = messageStr, debugStr = messageStr;
    if (error instanceof Error) {
        consoleStr += ` | ${error.message}`;
        debugStr += `\n\t${error.message}\n\t${error.stack}`;
    }
    if (writeToConsole)
        // tslint:disable-next-line: no-console
        console.log(consoleStr);
    return new Promise(async (resolve) => {
        debugLogWriter.write(debugStr + "\n", () => resolve());
        if (writeToConsole)
            consoleLogWriter.write(consoleStr + "\n", () => resolve());
    });
}
function logEvent(action, parameters) {
    return eventLogger.logEvent(action, parameters);
}
exports.default = {
    consoleLog: (message) => logMessage(message, true, "[INFO]").catch(),
    debugLog: (message) => logMessage(message, false, "[DEBUG]").catch(),
    consoleLogError: (message, error) => logMessage(message, true, "[ERROR]", error || true).catch(),
    debugLogError: (message, error) => logMessage(message, false, "[ERROR_DEBUG]", error || true).catch(),
    logEvent,
};
//# sourceMappingURL=logger.js.map