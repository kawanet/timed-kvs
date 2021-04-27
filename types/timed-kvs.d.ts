/**
 * timed-kvs.d.ts
 */

export namespace TKVS {

    export interface Envelope<T> {
        value: T;
    }

    interface Options {
        // TTL in milliseconds
        expires?: number;

        // maximum number of items stored in the storage
        maxItems?: number;
    }
}

export class TimedKVS<T> {
    constructor(options?: TKVS.Options);

    get(key: string): T;

    getItem(key: string): TKVS.Envelope<T>;

    set(key: string, value: T): void;

    setItem(key: string, value: TKVS.Envelope<T>): void;

    delete(key: string): void;

    values(): T[];
}
