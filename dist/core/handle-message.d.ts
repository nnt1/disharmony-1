import { Message as DjsMessage } from "discord.js";
import { Client, DisharmonyClient, DisharmonyMessage } from "..";
export default function handleMessage<TMessage extends DisharmonyMessage>(client: DisharmonyClient<TMessage>, djsMessage: DjsMessage, innerGetCommandInvoker?: (client: Client, message: DisharmonyMessage) => Promise<((disharmonyClient: Client, message: DisharmonyMessage) => Promise<string>) | null>): Promise<void>;
