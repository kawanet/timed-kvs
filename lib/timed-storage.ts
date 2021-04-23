/**
 * timed-storage.ts
 */

import {TimedStorage as types} from "../types/timed-storage";
import {LinkedStorage} from "./linked-storage";

type Envelope<T> = types.Envelope<T>;

interface Item<T> extends Envelope<T> {
    ttl?: number;
}

/**
 * Storage with TTL for each entries
 */

export class TimedStorage<T> {
    private expires: number;
    private maxItems: number;
    private lastShrink: number = 0;
    private items = new LinkedStorage<T>();

    constructor(options?: types.Options) {
        const {expires, maxItems} = options || {};
        this.expires = (expires > 0) && +expires || 0;
        this.maxItems = (maxItems > 0) && +maxItems || 0;
    }

    get(key: string): T {
        const item = this.getItem(key);
        if (item) return item.value;
    }

    set(key: string, value: T): void {
        this.setItem(key, {value: value});
    }

    delete(key: string): void {
        const {items} = this;
        items.delete(key);
    }

    getItem(key: string): Envelope<T> {
        const {expires, items, maxItems} = this;
        const item = items.getItem(key);
        if (!item) return;

        if (expires) {
            const now = Date.now();
            // if the cached items is expired, remove rest of items as expired as well.
            if (now > (item as Item<T>).ttl) {
                items.truncate(item);
                return;
            }
        }

        if (maxItems && maxItems < items.size()) {
            this.shrink();
        }

        return item as Envelope<T>;
    }

    setItem(key: string, item: Envelope<T>): void {
        const {expires, items, maxItems} = this;

        if (expires) {
            const now = Date.now();
            (item as Item<T>).ttl = now + expires;
        }

        items.setItem(key, item);

        if (maxItems && maxItems < items.size()) {
            this.shrink();
        }
    }

    shrink(size?: number): void {
        const {items, maxItems} = this;

        if (size) {
            return items.shrink(size);
        }

        const now = Date.now();

        // wait for maxItems milliseconds after the last .limit() method invoked as it costs O(n)
        if (!(now < this.lastShrink + maxItems)) {
            this.lastShrink = now;
            items.shrink(maxItems);
        }
    }

    values(): T[] {
        return this.items.values();
    }
}
