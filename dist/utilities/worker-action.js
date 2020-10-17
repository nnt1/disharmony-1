"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const __1 = require("..");
/** Base class representing a module which can be easily launched in a worker module.
 *  Will automatically connect to Discord and provide a LightClient instance
 */
class WorkerAction {
    constructor(client) {
        this.client = client;
    }
    static bootstrapWorkerModule(moduleCtor) {
        const configPath = process.argv[2];
        const config = __1.loadConfig(undefined, configPath);
        const client = new __1.LiteDisharmonyClient(config);
        const module = new moduleCtor(client);
        client.login(config.token)
            .then(async () => {
            await module.invoke();
            await client.destroy();
            await __1.Logger.debugLog("Exiting worker");
            process.exit(0);
        })
            .catch(async (err) => {
            await __1.Logger.debugLogError("Error invoking module in worker process", err);
            await __1.Logger.logEvent("ErrorInWorkerModule");
            process.exit(1);
        });
    }
    /** @abstract */
    async invoke() {
        return;
    }
}
exports.default = WorkerAction;
async function invokeWorkerAction(path, useMainProcess, processArg) {
    await __1.Logger.debugLog(`Loading worker module in ${useMainProcess ? "main" : "worker"} process`);
    if (useMainProcess) {
        const moduleCtor = (await Promise.resolve().then(() => require(path))).default;
        await new moduleCtor(processArg).invoke();
    }
    else
        __1.forkWorkerClient(path_1.resolve(path), processArg);
}
exports.invokeWorkerAction = invokeWorkerAction;
//# sourceMappingURL=worker-action.js.map