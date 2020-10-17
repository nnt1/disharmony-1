import EventLogger from "./event-logger";
export default class FileEventLogger implements EventLogger {
    private logWriter;
    logEvent(action: string, parameters: any): Promise<void>;
    constructor(path: string);
}
