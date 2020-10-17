import { SimpleEventDispatcher } from "strongly-typed-events";
import { NotifyPropertyChanged } from "..";
import Document from "./document";
import Serializable from "./serializable";
export default abstract class SubDocument extends Serializable implements NotifyPropertyChanged {
    onPropertyChanged: SimpleEventDispatcher<string>;
    static getArrayProxy<T extends SubDocument>(proxyTarget: any[], parent: Document, serializeName: string, ctor: new () => T): T[];
    private static tryAddSetOperator;
}
