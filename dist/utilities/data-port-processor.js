"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const https_1 = require("https");
const __1 = require("..");
const pending_data_ports_1 = require("../models/internal/pending-data-ports");
const worker_action_1 = require("./worker-action");
class DataPortProcessor extends worker_action_1.default {
    /** @override */
    async invoke() {
        await __1.Logger.debugLog("Beginning iteration of pending data ports");
        const pendingPorts = new pending_data_ports_1.default();
        await pendingPorts.loadDocument();
        if (pendingPorts.allPending.length === 0) {
            await __1.Logger.debugLog("No pending data ports found");
        }
        for (const pendingPort of pendingPorts.allPending) {
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
                await this.processDataPortForPendingEntry(pendingPort);
            }
            catch (err) {
                await __1.Logger.debugLogError(`Error processing data port for member ${pendingPort.memberId} in guild ${pendingPort.guildId}`);
            }
        }
        await pendingPorts.deleteRecord();
        await __1.Logger.debugLog("Finished iterating pending data ports");
    }
    async processDataPortForPendingEntry(pendingPort) {
        // Fetch data for this guild
        const djsGuild = this.client.djs.guilds.get(pendingPort.guildId);
        if (!djsGuild)
            return;
        const guild = new __1.DisharmonyGuild(djsGuild);
        const isMemberStillInGuild = guild.djs.members.has(pendingPort.memberId);
        if (!isMemberStillInGuild)
            return;
        await guild.loadDocument();
        const channel = guild.djs.channels.get(pendingPort.channelId);
        // Process the import or export
        let filePath;
        if (pendingPort.isImport && pendingPort.url)
            filePath = await this.processImport(pendingPort, guild, channel);
        else
            filePath = await this.processExport(pendingPort, guild, channel);
        if (filePath)
            await fs_1.promises.unlink(filePath);
    }
    async processImport(pendingPort, guild, channel) {
        // Set up the file to be piped into
        const dir = ".imports";
        await fs_1.promises.mkdir(dir, { recursive: true });
        const filePath = `${dir}/${pendingPort.guildId}`;
        const writeStream = fs_1.createWriteStream(filePath);
        const response = await new Promise(resolve => https_1.get(pendingPort.url, resolve));
        // Exit if response is not successful
        if (response.statusCode !== 200) {
            __1.Logger.debugLogError(`Failed to fetch the import file for guild ${pendingPort.guildId} from url ${pendingPort.url}`);
            return "";
        }
        // Pipe the response data to a file
        try {
            const writePromise = new Promise(resolve => {
                response.pipe(writeStream);
                writeStream.on("close", resolve);
            });
            await writePromise;
            writeStream.close();
        }
        catch (err) {
            await fs_1.promises.unlink(filePath);
            await __1.Logger.debugLogError(`Error piping response to file when downloading import for guild ${pendingPort.guildId} from url ${pendingPort.url}`, err);
            return "";
        }
        // Load the file
        let data;
        try {
            const contents = await fs_1.promises.readFile(filePath, "utf8");
            data = JSON.parse(contents);
        }
        catch (err) {
            await __1.Logger.debugLogError(`Failed to load JSON data from file ${filePath}`, err);
            return "";
        }
        // Validate the data
        if (!data._id)
            return "";
        // Create a new Guild instance
        const document = new __1.DisharmonyGuild(guild.djs);
        document.loadRecord(data);
        // Write the new entry to the database
        await document.save();
        try {
            await channel.send(`<@${pendingPort.memberId}> Your data import is complete!`);
        }
        catch (err) {
            __1.Logger.debugLogError(`Error sending import confirmation message for guild ${pendingPort.guildId}`, err);
        }
        return filePath;
    }
    async processExport(pendingPort, guild, channel) {
        const exportJson = guild.getExportJson();
        // Generate file containing JSON
        const dir = ".exports";
        await fs_1.promises.mkdir(dir, { recursive: true });
        const fileName = `${dir}/${pendingPort.guildId}-${pendingPort.memberId}.json`;
        await fs_1.promises.writeFile(fileName, exportJson);
        // Send JSON file to member
        const attachment = new discord_js_1.Attachment(fileName, `${pendingPort.guildId}.json`);
        try {
            await channel.send(`<@${pendingPort.memberId}> Here is your JSON data export file`, attachment);
        }
        catch (err) {
            __1.Logger.debugLogError(`Error uploading export file to channel ${pendingPort.channelId} in guild ${pendingPort.guildId}`, err);
        }
        return fileName;
    }
}
exports.default = DataPortProcessor;
if (!module.parent)
    worker_action_1.default.bootstrapWorkerModule(DataPortProcessor);
//# sourceMappingURL=data-port-processor.js.map