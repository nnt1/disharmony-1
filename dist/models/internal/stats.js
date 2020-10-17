"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stats {
    constructor(dClient) {
        this.dClient = dClient;
    }
    get guildCount() { return this.dClient.guilds.size; }
    get userCount() { return this.dClient.users.size; }
    get uptime() { return this.dClient.uptime; }
    get uptimeStr() { return this.toHHMMSS(this.uptime); }
    toHHMMSS(ms) {
        const secsTruncated = Math.trunc(ms / 1000);
        const hrs = Math.floor(secsTruncated / 3600);
        const mins = Math.floor((secsTruncated - (hrs * 3600)) / 60);
        const secs = secsTruncated - (hrs * 3600) - (mins * 60);
        let hoursStr = hrs.toString(), minsStr = mins.toString(), secsStr = secs.toString();
        if (hrs < 10)
            hoursStr = "0" + hrs;
        if (mins < 10)
            minsStr = "0" + mins;
        if (secs < 10)
            secsStr = "0" + secs;
        return `${hoursStr}:${minsStr}:${secsStr}`;
    }
}
exports.default = Stats;
//# sourceMappingURL=stats.js.map