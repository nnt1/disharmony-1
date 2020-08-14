"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const requestPromise = require("request-promise-native");
const __1 = require("..");
const event_strings_1 = require("../utilities/logging/event-strings");
const worker_action_1 = require("../utilities/worker-action");
class ClientIntervalManager {
    constructor(client) {
        this.client = client;
    }
    /** Use setInterval to start various callback intervals */
    setIntervalCallbacks() {
        if (this.client.config.heartbeat)
            this.setHeartbeatInterval();
        this.setMemoryMeasureInterval();
        this.setExportGenerationInterval();
    }
    /** Clear any intervals who's functionality requires a Discord connection */
    clearConnectionDependentIntervals() {
        if (this.heartbeatInterval)
            clearInterval(this.heartbeatInterval);
        if (this.exportInterval)
            clearInterval(this.exportInterval);
    }
    setHeartbeatInterval() {
        const intervalMs = this.client.config.heartbeat.intervalSec * 1000;
        this.sendHeartbeat(true)
            .then(() => this.heartbeatInterval = setInterval(() => this.sendHeartbeat.bind(this)(), intervalMs))
            .catch(() => __1.Logger.debugLogError("Error sending initial heartbeat, interval setup abandoned"));
    }
    setMemoryMeasureInterval() {
        const intervalMs = (this.client.config.memoryMeasureIntervalSec || 600) * 1000;
        setInterval(__1.Logger.logEvent, intervalMs, event_strings_1.EventStrings.MemoryMeasured, process.memoryUsage());
    }
    setExportGenerationInterval() {
        this.exportInterval = setInterval(this.invokeExportGenerator.bind(this), 5 * 60 * 1000);
    }
    /** Send the heartbeat HTTP request
     * @param rethrow Whether to rethrow any caught errors
     */
    async sendHeartbeat(rethrow) {
        try {
            await requestPromise.get(this.client.config.heartbeat.url);
        }
        catch (err) {
            __1.Logger.debugLogError("Error sending heartbeat", err);
            __1.Logger.logEvent(event_strings_1.EventStrings.SendHeartbeatError);
            if (rethrow)
                throw err;
        }
    }
    async invokeExportGenerator() {
        const isDbLocal = this.client.config.computedValues.isLocalDb;
        return worker_action_1.invokeWorkerAction(path_1.resolve(__dirname, "../utilities/data-port-processor"), isDbLocal, (isDbLocal ? this.client : this.client.config.computedValues.configPath));
    }
}
exports.default = ClientIntervalManager;
//# sourceMappingURL=client-interval-manager.js.map