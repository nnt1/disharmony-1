import { Guild as DjsGuild } from "discord.js";
import Document from "../document";
import DisharmonyGuildMember from "./disharmony-guild-member";
import DjsExtensionModel from "./djs-extension-model";
export default class DisharmonyGuild extends Document implements DjsExtensionModel<DjsGuild> {
    readonly djs: DjsGuild;
    readonly me: DisharmonyGuildMember;
    readonly name: string;
    readonly commandPrefix: any;
    /** @deprecated Use `botHasPermissions` instead */
    readonly hasPermissions: (permissions: number) => boolean;
    botHasPermissions(permissions: number): boolean;
    getExportJson(): string;
    constructor(djs: DjsGuild);
}
