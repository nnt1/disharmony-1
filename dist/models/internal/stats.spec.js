"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const alsatian_1 = require("alsatian");
const typemoq_1 = require("typemoq");
const stats_1 = require("./stats");
let StatsTestFixture = class StatsTestFixture {
    setup() {
        this.djsClient = typemoq_1.Mock.ofType();
    }
    zero_hour_zero_minute_uptime_string_correct() {
        // ARRANGE
        this.djsClient
            .setup(x => x.uptime)
            .returns(() => 15 * 1000);
        // ACT
        const sut = new stats_1.default(this.djsClient.object);
        // ASSERT
        alsatian_1.Expect(sut.uptimeStr).toBe("00:00:15");
    }
    zero_hour_multi_minute_uptime_string_correct() {
        // ARRANGE
        this.djsClient
            .setup(x => x.uptime)
            .returns(() => 1815 * 1000);
        // ACT
        const sut = new stats_1.default(this.djsClient.object);
        // ASSERT
        alsatian_1.Expect(sut.uptimeStr).toBe("00:30:15");
    }
    multi_hour_multi_minute_uptime_string_correct() {
        // ARRANGE
        this.djsClient
            .setup(x => x.uptime)
            .returns(() => 5415 * 1000);
        // ACT
        const sut = new stats_1.default(this.djsClient.object);
        // ASSERT
        alsatian_1.Expect(sut.uptimeStr).toBe("01:30:15");
    }
};
__decorate([
    alsatian_1.Setup
], StatsTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.Test()
], StatsTestFixture.prototype, "zero_hour_zero_minute_uptime_string_correct", null);
__decorate([
    alsatian_1.Test()
], StatsTestFixture.prototype, "zero_hour_multi_minute_uptime_string_correct", null);
__decorate([
    alsatian_1.Test()
], StatsTestFixture.prototype, "multi_hour_multi_minute_uptime_string_correct", null);
StatsTestFixture = __decorate([
    alsatian_1.TestFixture("Stats model transformations")
], StatsTestFixture);
exports.StatsTestFixture = StatsTestFixture;
//# sourceMappingURL=stats.spec.js.map