"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utilities/logging/logger");
const mongo_client_1 = require("./mongo-client");
const nedb_client_1 = require("./nedb-client");
function getDbClient(connectionString, onCriticalError, clientConfig) {
    const protocol = connectionString.match(/^.+:\/\//)[0];
    if (protocol) {
        logger_1.default.consoleLog(`Using database protocol ${protocol}`);
        if (protocol.startsWith("mongodb"))
            return new mongo_client_1.default(connectionString, onCriticalError, clientConfig);
        else if (protocol.startsWith("nedb"))
            return new nedb_client_1.default(connectionString);
    }
    throw new Error("Invalid connection string");
}
exports.default = getDbClient;
var CriticalError;
(function (CriticalError) {
    CriticalError["ReconnectFail"] = "Reconnect failure";
})(CriticalError = exports.CriticalError || (exports.CriticalError = {}));
//# sourceMappingURL=db-client.js.map