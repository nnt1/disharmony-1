"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cluster = require("cluster");
const __1 = require("..");
function default_1(modulePath, configPath) {
    Cluster.setupMaster({
        exec: modulePath,
        args: [configPath],
    });
    const worker = Cluster.fork();
    addKillAndExitHooks(worker);
    __1.Logger.debugLog(`Spawned worker process ${worker.process.pid} with module path ${modulePath}`);
    return worker;
}
exports.default = default_1;
function addKillAndExitHooks(worker) {
    const killWorker = () => worker.kill();
    process.on("exit", killWorker);
    process.on("SIGINT", killWorker);
    process.on("SIGTERM", killWorker);
    worker.on("exit", () => {
        __1.Logger.debugLog(`Worker process ${worker.process.pid} exited`);
        process.off("exit", killWorker);
        process.off("SIGINT", killWorker);
        process.off("SIGTERM", killWorker);
    });
}
//# sourceMappingURL=fork-worker.js.map