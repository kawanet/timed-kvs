/**
 * timed-storage.ts
 */

import {TimedStorage as ITimeStorage, TS} from "../types/timed-storage";
import {LinkedStorage} from "./linked-storage";

interface Item<T> extends TS.Envelope<T> {
    ttl?: number;
}

/**
 * Storage with TTL for each entries
 */

export class TimedStorage<T> extends LinkedStorage<T> implements ITimeStorage<T> {
    private expires: number;
    private maxItems: number;
    private gcTimeout: any;

    constructor(options?: TS.Options) {
        super();
        const {expires, maxItems} = options || {};
        this.expires = (expires > 0) && +expires || 0;
        this.maxItems = (maxItems > 0) && +maxItems || 0;
    }

    getItem(key: string): TS.Envelope<T> {
        const {expires} = this;
        const item = super.getItem(key);
        if (!item) return;

        if (expires) {
            const now = Date.now();
            // if the cached item is expired, remove rest of super as expired as well.
            if (now > (item as Item<T>).ttl) {
                super.truncate(item);
                return;
            }
        }

        return item as TS.Envelope<T>;
    }

    setItem(key: string, item: TS.Envelope<T>): void {
        const {expires, maxItems} = this;

        if (expires) {
            const now = Date.now();
            (item as Item<T>).ttl = now + expires;
        }

        super.setItem(key, item);

        if (maxItems) {
            if (this.gcTimeout || maxItems >= this.size()) return;

            // garbage collection in background
            this.gcTimeout = setTimeout(() => {
                this.shrink(maxItems);
                delete this.gcTimeout;
            }, 1000);
        }
    }
}
