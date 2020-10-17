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
const document_1 = require("./document");
let DocumentTestFixture = class DocumentTestFixture {
    setup() {
        this.dbClient = typemoq_1.Mock.ofType();
        this.dbClient.setup(x => x.isReconnecting).returns(() => false);
    }
    async db_client_receives_insert_when_load_document_called_for_new_record() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            get num() { return this.record.num; }
            set num(value) { this.record.num = value; }
            constructor() {
                super("id");
                this.isNewRecord = true;
            }
        }
        this.dbClient
            .setup(x => x.findOne(typemoq_1.It.isAnyString(), typemoq_1.It.isAny()))
            .returns(() => Promise.resolve(null));
        // ACT
        const sut = new Derived();
        await sut.loadDocument();
        // ASSERT
        this.dbClient.verify(x => x.insertOne("Derived", { _id: "id" }), typemoq_1.Times.once());
    }
    db_client_receives_insert_when_new_serializable_saved() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            constructor() {
                super("id");
                this.record = { a: 1 };
                this.isNewRecord = true;
            }
        }
        // ACT
        new Derived().save();
        // ASSERT
        this.dbClient.verify(x => x.insertOne("Derived", { _id: "id", a: 1 }), typemoq_1.Times.once());
    }
    async db_client_receives_update_when_serializable_updated_and_saved() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            get num() { return this.record.num; }
            set num(value) { this.record.num = value; }
            constructor() {
                super("id");
                this.isNewRecord = false;
            }
        }
        this.dbClient
            .setup(x => x.findOne("Derived", typemoq_1.It.isAny()))
            .returns(() => Promise.resolve({ num: 1 }));
        // ACT
        const sut = new Derived();
        await sut.loadDocument();
        sut.num = 2;
        sut.save();
        // ASSERT
        this.dbClient.verify(x => x.updateOne("Derived", { _id: "id" }, { $set: { num: 2 } }), typemoq_1.Times.once());
    }
    async db_client_receives_replace_when_neither_update_nor_insert_valid() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            constructor() {
                super("id");
                this.record = { arr: [0, 1, 2] };
                this.isNewRecord = false;
            }
        }
        const sut = new Derived();
        // ACT
        // In-place array modifications aren't detectable, so won't be included as a $set operator
        sut.record.arr.splice(0, 1);
        await sut.save();
        // ASSERT
        this.dbClient.verify(x => x.replaceOne("Derived", { _id: "id" }, { _id: "id", arr: [1, 2] }), typemoq_1.Times.once());
    }
    async db_client_in_ready_state_when_save_complete() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            constructor() {
                super("id");
                this.record = { a: 1 };
                this.isNewRecord = true;
            }
        }
        const sut = new Derived();
        sut.updateFields = { whatever: "abc" };
        sut.isNewRecord = true;
        // ACT
        await sut.save();
        // ASSERT
        alsatian_1.Expect(Object.keys(sut.updateFields).length).toBe(0);
        alsatian_1.Expect(sut.isNewRecord).toBe(false);
    }
    async serializable_record_set_to_db_value_when_serializable_loads_record() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            get exposedRecord() { return this.record; }
            constructor() { super("id"); }
        }
        this.dbClient
            .setup(x => x.findOne("Derived", typemoq_1.It.isAny()))
            .returns(() => Promise.resolve({ a: 1 }));
        // ACT
        const sut = new Derived();
        await sut.loadDocument();
        // ASSERT
        alsatian_1.Expect(sut.exposedRecord).toEqual({ a: 1 });
    }
    async load_document_throws_if_error_returned_when_serializable_loads_record() {
        // ARRANGE
        document_1.default.dbClient = this.dbClient.object;
        class Derived extends document_1.default {
            get exposedRecord() { return this.record; }
            constructor() { super("id"); }
        }
        this.dbClient
            .setup(x => x.findOne("Derived", typemoq_1.It.isAny()))
            .returns(() => Promise.reject("error"));
        // ACT
        const sut = new Derived();
        // ASSERT
        await alsatian_1.Expect(async () => await sut.loadDocument()).toThrowAsync();
    }
};
__decorate([
    alsatian_1.Setup
], DocumentTestFixture.prototype, "setup", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "db_client_receives_insert_when_load_document_called_for_new_record", null);
__decorate([
    alsatian_1.Test()
], DocumentTestFixture.prototype, "db_client_receives_insert_when_new_serializable_saved", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "db_client_receives_update_when_serializable_updated_and_saved", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "db_client_receives_replace_when_neither_update_nor_insert_valid", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "db_client_in_ready_state_when_save_complete", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "serializable_record_set_to_db_value_when_serializable_loads_record", null);
__decorate([
    alsatian_1.AsyncTest()
], DocumentTestFixture.prototype, "load_document_throws_if_error_returned_when_serializable_loads_record", null);
DocumentTestFixture = __decorate([
    alsatian_1.TestFixture("Document base class")
], DocumentTestFixture);
exports.DocumentTestFixture = DocumentTestFixture;
//# sourceMappingURL=document.spec.js.map