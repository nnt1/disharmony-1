export default abstract class Serializable {
    protected record: any;
    /** OVERRIDABLE: Perform any necessary tasks to convert this instance to a record; make sure to invoke super if overriding */
    abstract toRecord(): any;
    /** OVERRIDABLE: Perform any necessary setup to load this instance from a record; make sure to invoke super if overriding */
    abstract loadRecord(record: any): void;
}
