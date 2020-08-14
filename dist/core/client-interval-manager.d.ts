import { Client } from "..";
export default class ClientIntervalManager {
    private client;
    private heartbeatInterval;
    private exportInterval;
    /** Use setInterval to start various callback intervals */
    setIntervalCallbacks(): void;
    /** Clear any intervals who's functionality requires a Discord connection */
    clearConnectionDependentIntervals(): void;
    private setHeartbeatInterval;
    private setMemoryMeasureInterval;
    private setExportGenerationInterval;
    /** Send the heartbeat HTTP request
     * @param rethrow Whether to rethrow any caught errors
     */
    private sendHeartbeat;
    private invokeExportGenerator;
    constructor(client: Client);
}
