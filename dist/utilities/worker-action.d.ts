import { LiteClient, LiteDisharmonyClient } from "..";
/** Base class representing a module which can be easily launched in a worker module.
 *  Will automatically connect to Discord and provide a LightClient instance
 */
export default abstract class WorkerAction {
    protected client: LiteDisharmonyClient;
    static bootstrapWorkerModule<T extends WorkerAction>(moduleCtor: new (client: LiteDisharmonyClient) => T): void;
    /** @abstract */
    invoke(): Promise<void>;
    constructor(client: LiteDisharmonyClient);
}
export declare function invokeWorkerAction(path: string, useMainProcess: boolean, mainProcessClient: LiteClient): Promise<void>;
export declare function invokeWorkerAction(path: string, useMainProcess: boolean, configPath: string): Promise<void>;
