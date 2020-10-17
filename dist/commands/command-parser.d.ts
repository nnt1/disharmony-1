import { Client } from "../core/client";
import DisharmonyMessage from "../models/discord/disharmony-message";
export default function getCommandInvoker(client: Client, message: DisharmonyMessage): Promise<((disharmonyClient: Client, message: DisharmonyMessage) => Promise<string>) | null>;
