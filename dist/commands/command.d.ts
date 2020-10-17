import { Client } from "../core/client";
import DisharmonyMessage from "../models/discord/disharmony-message";
declare type InvokeFunc = (params: string[], message: DisharmonyMessage | any, client: Client) => Promise<string | void>;
export declare enum PermissionLevel {
    Anyone = 0,
    Admin = 1,
    HostOwner = 2
}
export default class Command {
    syntax: string;
    description: string;
    permissionLevel: PermissionLevel;
    invoke: InvokeFunc;
    hidden: boolean;
    constructor(syntax: string, description: string, permissionLevel: PermissionLevel, invoke: InvokeFunc, hidden?: boolean);
}
export {};
