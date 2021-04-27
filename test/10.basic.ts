#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedKVS} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("set() get()", async () => {
        const store = new TimedKVS<Promise<string>>();
        assert.deepEqual(await getArray(store), []);

        store.set("foo", Promise.resolve("FOO"));
        assert.equal(await store.get("foo"), "FOO");
        assert.deepEqual(await getArray(store), ["FOO"]);

        assert.equal(await store.get("bar"), undefined);

        store.set("buz", Promise.resolve("BUZ-1"));
        store.set("buz", Promise.resolve("BUZ-2"));
        assert.equal(await store.get("buz"), "BUZ-2");
        assert.deepEqual(await getArray(store), ["FOO", "BUZ-2"]);
    });

    it("delete()", async () => {
        const store = new TimedKVS<Promise<number>>();

        store.set("1", Promise.resolve(1));
        store.set("2", Promise.resolve(2));
        store.set("3", Promise.resolve(3));
        store.set("4", Promise.resolve(4));
        store.set("5", Promise.resolve(5));

        assert.deepEqual(await getArray(store), [1, 2, 3, 4, 5]);

        store.delete("1");
        assert.equal(await store.get("1"), undefined);
        assert.deepEqual(await getArray(store), [2, 3, 4, 5]);

        store.delete("5");
        assert.equal(await store.get("5"), undefined);
        assert.deepEqual(await getArray(store), [2, 3, 4]);

        store.delete("3");
        assert.equal(await store.get("3"), undefined);
        assert.deepEqual(await getArray(store), [2, 4]);

        store.delete("2");
        assert.equal(await store.get("2"), undefined);
        assert.deepEqual(await getArray(store), [4]);

        store.delete("4");
        assert.equal(await store.get("4"), undefined);
        assert.deepEqual(await getArray(store), []);
    });
});

async function getArray<T>(store: TimedKVS<T>): Promise<T[]> {
    return Promise.all(store.values());
}