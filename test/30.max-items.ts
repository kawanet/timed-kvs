#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedKVS} from "../";

const TITLE = __filename.split("/").pop();
const WAIT = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

describe(TITLE, () => {
    it("maxItems", async () => {
        const store = new TimedKVS<string>({maxItems: 5});

        let counter = 0;
        const cache = (key: string) => {
            const prev = store.get(key);
            if (prev) return prev;
            const val = key + ":" + (++counter);
            store.set(key, val);
            return val;
        };

        assert.equal(cache("foo"), "foo:1");
        assert.equal(cache("bar"), "bar:2");
        assert.equal(cache("buz"), "buz:3");
        assert.equal(cache("qux"), "qux:4");
        assert.equal(cache("quux"), "quux:5");

        // check cached values
        assert.equal(cache("foo"), "foo:1"); // cached
        assert.equal(cache("bar"), "bar:2");
        assert.equal(cache("buz"), "buz:3");
        assert.equal(cache("qux"), "qux:4");
        assert.equal(cache("quux"), "quux:5");

        // this exceeds maxItems limit and removes "foo" then
        assert.equal(cache("corge"), "corge:6");
        assert.equal(cache("corge"), "corge:6"); // cached

        // wait a moment for garbage collection completed
        await WAIT(100);

        // this refreshes "foo" and removes "bar" then
        assert.equal(store.get("foo"), undefined); // removed
        assert.equal(cache("foo"), "foo:7"); // refreshed
        assert.equal(cache("foo"), "foo:7"); // cached

        // wait a moment for garbage collection completed
        await WAIT(100);

        assert.equal(store.get("bar"), undefined); // removed

        assert.equal(cache("buz"), "buz:3");
        assert.equal(cache("qux"), "qux:4");
        assert.equal(cache("quux"), "quux:5");
    });
});
