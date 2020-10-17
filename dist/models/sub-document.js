"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strongly_typed_events_1 = require("strongly-typed-events");
const serializable_1 = require("./serializable");
class SubDocument extends serializable_1.default {
    constructor() {
        super(...arguments);
        this.onPropertyChanged = new strongly_typed_events_1.SimpleEventDispatcher();
    }
    static getArrayProxy(proxyTarget, parent, serializeName, ctor) {
        return new Proxy(proxyTarget, {
            get: (target, prop) => {
                // If prop is array index, create T from data if not already created
                if (typeof prop === "string" && !isNaN(Number(prop)) && !(target[prop] instanceof SubDocument)) {
                    const subDoc = new ctor();
                    subDoc.loadRecord(target[prop]);
                    subDoc.onPropertyChanged.sub(() => this.tryAddSetOperator(parent, serializeName, prop, subDoc));
                    target[prop] = subDoc;
                }
                return target[prop];
            },
            set: (target, prop, value) => {
                target[prop] = value;
                if (typeof prop === "string" && !isNaN(Number(prop)))
                    this.tryAddSetOperator(parent, serializeName, prop, target[prop]);
                return true;
            },
        });
    }
    static tryAddSetOperator(parent, arrayFieldName, idxStr, subDocument) {
        /* If the field has had a direct write to it, writing to an index will cause a conflict.
           The current pending updates should be flushed before modifying subdocuments by index. */
        if (parent.updateFields[arrayFieldName])
            throw new Error(`Can't modify subdocument of '${arrayFieldName}' when there is a pending write to the field itself`);
        parent.addSetOperator(`${arrayFieldName}.${idxStr}`, subDocument.toRecord());
    }
}
exports.default = SubDocument;
//# sourceMappingURL=sub-document.js.map