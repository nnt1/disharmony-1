declare function logEvent(action: string, parameters?: any): void | Promise<void>;
declare const _default: {
    consoleLog: (message: string) => void | Promise<void>;
    debugLog: (message: string) => void | Promise<void>;
    consoleLogError: (message: string, error?: Error | undefined) => void | Promise<void>;
    debugLogError: (message: string, error?: Error | undefined) => void | Promise<void>;
    logEvent: typeof logEvent;
};
export default _default;
