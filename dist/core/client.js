"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strongly_typed_events_1 = require("strongly-typed-events");
const __1 = require("..");
const inbuilt_commands_1 = require("../inbuilt-commands");
const disharmony_guild_member_1 = require("../models/discord/disharmony-guild-member");
const disharmony_message_1 = require("../models/discord/disharmony-message");
const stats_1 = require("../models/internal/stats");
const event_strings_1 = require("../utilities/logging/event-strings");
const client_interval_manager_1 = require("./client-interval-manager");
const handle_message_1 = require("./handle-message");
const lite_client_1 = require("./lite-client");
class DisharmonyClient extends lite_client_1.default {
    constructor(commands, config, messageCtor = disharmony_message_1.default, guildMemberCtor = disharmony_guild_member_1.default) {
        super(config);
        this.config = config;
        this.messageCtor = messageCtor;
        this.guildMemberCtor = guildMemberCtor;
        this.onBeforeLogin = new strongly_typed_events_1.SignalDispatcher();
        this.onReady = new strongly_typed_events_1.SignalDispatcher();
        this.onMessage = new strongly_typed_events_1.SimpleEventDispatcher();
        this.onVoiceStateUpdate = new strongly_typed_events_1.SimpleEventDispatcher();
        this.djs.on("ready", () => this.onReady.dispatch());
        this.djs.on("message", dMsg => handle_message_1.default(this, dMsg));
        this.djs.on("guildCreate", guild => __1.Logger.logEvent(event_strings_1.EventStrings.GuildAdd, { guildId: guild.id }));
        this.djs.on("voiceStateUpdate", this.dispatchVoiceStateUpdateIfPermitted.bind(this));
        this.commands = commands.concat(inbuilt_commands_1.default);
        this.stats = new stats_1.default(this.djs);
        this.intervalManager = new client_interval_manager_1.default(this);
    }
    get channels() { return this.djs.channels; }
    async login(token) {
        await super.login(token);
        this.intervalManager.setIntervalCallbacks();
        if (this.config.playingStatusString)
            await this.djs.user.setPresence({ game: { name: this.config.playingStatusString } });
    }
    async destroy() {
        this.intervalManager.clearConnectionDependentIntervals();
        await super.destroy();
    }
    dispatchMessage(message) {
        this.onMessage.dispatch(message);
    }
    dispatchVoiceStateUpdateIfPermitted(oldDjsMember, newDjsMember) {
        const voiceChannel = (newDjsMember.voiceChannel || oldDjsMember.voiceChannel);
        // Sometimes this is undefined, no idea why
        if (!voiceChannel)
            return;
        const botPerms = voiceChannel.permissionsFor(voiceChannel.guild.me);
        // Solve the issue where Discord sends voice state update events even when a voice channel is hidden from the bot
        if (botPerms && botPerms.has("VIEW_CHANNEL"))
            this.onVoiceStateUpdate.dispatch({ oldMember: new this.guildMemberCtor(oldDjsMember), newMember: new this.guildMemberCtor(newDjsMember) });
    }
}
exports.default = DisharmonyClient;
//# sourceMappingURL=client.js.map