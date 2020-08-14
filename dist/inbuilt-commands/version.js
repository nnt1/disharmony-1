"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../commands/command");
function invoke() {
    return Promise.resolve(require(process.cwd() + "/package.json").version);
}
exports.default = new command_1.default(
/*syntax*/ "version", 
/*description*/ "Returns the current version of the bot", 
/*permissionLevel*/ command_1.PermissionLevel.Anyone, 
/*invoke*/ invoke);
//# sourceMappingURL=version.js.map