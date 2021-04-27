/**
 * timed-kvs.ts
 */

import {TimedKVS as ITimedKVS, TKVS} from "../types/timed-kvs";
import {LinkedKVS} from "./linked-kvs";

interface Item<T> extends TKVS.Envelope<T> {
    ttl?: number;
}

/**
 * Storage with TTL for each entries
 */

export class TimedKVS<T> extends LinkedKVS<T> implements ITimedKVS<T> {
    private expires: number;
    private maxItems: number;
    private gcTimeout: any;

    constructor(options?: TKVS.Options) {
        super();
        const {expires, maxItems} = options || {};
        this.expires = (expires > 0) && +expires || 0;
        this.maxItems = (maxItems > 0) && +maxItems || 0;
    }

    getItem(key: string): TKVS.Envelope<T> {
        const {expires} = this;
        const item = super.getItem(key);
        if (!item) return;

        if (expires) {
            const now = Date.now();
            // if the cached item is expired, remove rest of super as expired as well.
            if (now > (item as Item<T>).ttl) {
                this.truncate(item);
                return;
            }
        }

        return item as TKVS.Envelope<T>;
    }

    setItem(key: string, item: TKVS.Envelope<T>): void {
        const {expires, maxItems} = this;

        if (expires) {
            const now = Date.now();
            (item as Item<T>).ttl = now + expires;
        }

        super.setItem(key, item);

        if (maxItems) {
            if (this.gcTimeout || maxItems >= this.size()) return;

            const gcDelay = Math.min(maxItems, 1000);

            // garbage collection in background
            this.gcTimeout = setTimeout(() => {
                this.shrink(maxItems);
                delete this.gcTimeout;
            }, gcDelay);
        }
    }
}
