/**
 * timed-storage.d.ts
 */

export namespace TimedStorage {

    export interface Envelope<T> {
        value: T;
    }

    interface Options {
        expires?: number;
        maxItems?: number;
    }
}

type Envelope<T> = TimedStorage.Envelope<T>;

export class TimedStorage<T> {
    constructor(options?: TimedStorage.Options);

    get(key: string): T;

    getItem(key: string): Envelope<T> ;

    set(key: string, value: T): void;

    setItem(key: string, value: Envelope<T>): void;

    delete(key: string): void;

    shrink(size?: number): void;

    values(): T[];
}
