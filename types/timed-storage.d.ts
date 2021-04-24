/**
 * timed-storage.d.ts
 */

export namespace TS {

    export interface Envelope<T> {
        value: T;
    }

    interface Options {
        expires?: number;
        maxItems?: number;
    }
}

export class TimedStorage<T> {
    constructor(options?: TS.Options);

    get(key: string): T;

    getItem(key: string): TS.Envelope<T>;

    set(key: string, value: T): void;

    setItem(key: string, value: TS.Envelope<T>): void;

    delete(key: string): void;

    shrink(size: number): void;

    values(): T[];
}
