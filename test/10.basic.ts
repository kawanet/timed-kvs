#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedKVS} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("set() get()", () => {
        const store = new TimedKVS<string>();
        assert.deepEqual(store.values(), []);

        store.set("foo", "FOO");
        assert.equal(store.get("foo"), "FOO");
        assert.deepEqual(store.values(), ["FOO"]);

        assert.equal(store.get("bar"), undefined);

        store.set("buz", "BUZ-1");
        store.set("buz", "BUZ-2");
        assert.equal(store.get("buz"), "BUZ-2");
        assert.deepEqual(store.values(), ["FOO", "BUZ-2"]);
    });

    it("delete()", () => {
        const store = new TimedKVS<number>();

        store.set("1", 1);
        store.set("2", 2);
        store.set("3", 3);
        store.set("4", 4);
        store.set("5", 5);

        assert.deepEqual(store.values(), [1, 2, 3, 4, 5]);

        store.delete("1");
        assert.equal(store.get("1"), undefined);
        assert.deepEqual(store.values(), [2, 3, 4, 5]);

        store.delete("5");
        assert.equal(store.get("5"), undefined);
        assert.deepEqual(store.values(), [2, 3, 4]);

        store.delete("3");
        assert.equal(store.get("3"), undefined);
        assert.deepEqual(store.values(), [2, 4]);

        store.delete("2");
        assert.equal(store.get("2"), undefined);
        assert.deepEqual(store.values(), [4]);

        store.delete("4");
        assert.equal(store.get("4"), undefined);
        assert.deepEqual(store.values(), []);
    });
});
