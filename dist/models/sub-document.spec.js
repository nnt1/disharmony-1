"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-floating-promises
const alsatian_1 = require("alsatian");
const typemoq_1 = require("typemoq");
const __1 = require("..");
const document_1 = require("./document");
class TestDocument extends document_1.default {
}
class TestSubDocument extends __1.SubDocument {
    get recordedString() { return this.record.recordedString; }
    set recordedString(value) { this.record.recordedString = value; }
    toRecord() { return this.record; }
    loadRecord(record) {
        this.record = record;
        this.ephemeralString = "loadRecord";
    }
}
let SubDocumentTestFixture = class SubDocumentTestFixture {
    setup() {
        this.dbClient = typemoq_1.Mock.ofType();
        this.dbClient.setup(x => x.isReconnecting).returns(() => false);
    }
    array_proxy_returns_class_instance_from_record_array_item() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        const parent = new TestDocument("id");
        // ACT
        const sut = __1.SubDocument.getArrayProxy([{ recordedString: "record" }], parent, "sub", TestSubDocument);
        // ASSERT
        alsatian_1.Expect(sut[0].recordedString).toBe("record");
        alsatian_1.Expect(sut[0].ephemeralString).toBe("loadRecord");
    }
    parent_document_updates_db_when_array_item_set() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        const parent = new TestDocument("id");
        // ACT
        const sut = __1.SubDocument.getArrayProxy([{ recordedString: "record" }], parent, "sub", TestSubDocument);
        const newEntry = new TestSubDocument();
        newEntry.recordedString = "updatedRecord";
        sut[0] = newEntry;
        parent.save();
        // ASSERT
        this.dbClient.verify(x => x.updateOne(typemoq_1.It.isAnyString(), typemoq_1.It.isAny(), { $set: { "sub.0": { recordedString: "updatedRecord" } } }), typemoq_1.Times.once());
    }
    same_instance_returned_when_repeat_access() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        const parent = new TestDocument("id");
        // ACT
        const sut = __1.SubDocument.getArrayProxy([{ recordedString: "record" }], parent, "sub", TestSubDocument);
        sut[0].ephemeralString = "modified";
        // ASSERT
        alsatian_1.Expect(sut[0].ephemeralString).toBe("modified");
    }
    error_thrown_when_setting_index_and_parent_pending_field_write() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        const parent = new TestDocument("id");
        parent.updateFields = { sub: [] };
        // ACT
        const sut = __1.SubDocument.getArrayProxy([{ recordedString: "record" }], parent, "sub", TestSubDocument);
        const newEntry = new TestSubDocument();
        newEntry.recordedString = "updatedRecord";
        // ASSERT
        alsatian_1.Expect(() => sut[0] = newEntry).toThrow();
    }
};
__decorate([
    alsatian_1.Setup
], SubDocumentTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.Test()
], SubDocumentTestFixture.prototype, "array_proxy_returns_class_instance_from_record_array_item", null);
__decorate([
    alsatian_1.Test()
], SubDocumentTestFixture.prototype, "parent_document_updates_db_when_array_item_set", null);
__decorate([
    alsatian_1.Test()
], SubDocumentTestFixture.prototype, "same_instance_returned_when_repeat_access", null);
__decorate([
    alsatian_1.Test()
], SubDocumentTestFixture.prototype, "error_thrown_when_setting_index_and_parent_pending_field_write", null);
SubDocumentTestFixture = __decorate([
    alsatian_1.TestFixture("SubDocment base class")
], SubDocumentTestFixture);
exports.SubDocumentTestFixture = SubDocumentTestFixture;
//# sourceMappingURL=sub-document.spec.js.map