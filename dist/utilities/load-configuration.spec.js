"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const alsatian_1 = require("alsatian");
const load_configuration_1 = require("./load-configuration");
let LoadConfigurationTestFixture = class LoadConfigurationTestFixture {
    config_valid_when_all_required_fields_present() {
        // ARRANGE
        const config = {
            dbConnectionString: "foo",
            token: "bar",
            serviceName: "baz",
            requiredPermissions: 1000,
            askTimeoutMs: 30,
        };
        // ACT
        const result = load_configuration_1.isConfigValid(config);
        // ASSERT
        alsatian_1.Expect(result).toBe(true);
    }
    config_valid_when_optional_field_present() {
        // ARRANGE
        const config = {
            dbConnectionString: "foo",
            token: "bar",
            serviceName: "baz",
            requiredPermissions: 1000,
            askTimeoutMs: 30,
            heartbeat: {
                url: "foo",
                intervalSec: 30,
            },
        };
        // ACT
        const result = load_configuration_1.isConfigValid(config);
        // ASSERT
        alsatian_1.Expect(result).toBe(true);
    }
    config_invalid_when_required_field_missing() {
        // ARRANGE
        const config = {
            dbConnectionString: "foo",
            token: "bar",
            serviceName: "baz",
            requiredPermissions: 1000,
        };
        // ACT
        const result = load_configuration_1.isConfigValid(config);
        // ASSERT
        alsatian_1.Expect(result).toBe(false);
    }
    config_invalid_when_optional_field_present_but_invalid() {
        // ARRANGE
        const config = {
            dbConnectionString: "foo",
            token: "bar",
            serviceName: "baz",
            requiredPermissions: 1000,
            askTimeoutMs: 30,
            heartbeat: {},
        };
        // ACT
        const result = load_configuration_1.isConfigValid(config);
        // ASSERT
        alsatian_1.Expect(result).toBe(false);
    }
};
__decorate([
    alsatian_1.Test()
], LoadConfigurationTestFixture.prototype, "config_valid_when_all_required_fields_present", null);
__decorate([
    alsatian_1.Test()
], LoadConfigurationTestFixture.prototype, "config_valid_when_optional_field_present", null);
__decorate([
    alsatian_1.Test()
], LoadConfigurationTestFixture.prototype, "config_invalid_when_required_field_missing", null);
__decorate([
    alsatian_1.Test()
], LoadConfigurationTestFixture.prototype, "config_invalid_when_optional_field_present_but_invalid", null);
LoadConfigurationTestFixture = __decorate([
    alsatian_1.TestFixture("Config loading")
], LoadConfigurationTestFixture);
exports.LoadConfigurationTestFixture = LoadConfigurationTestFixture;
//# sourceMappingURL=load-configuration.spec.js.map