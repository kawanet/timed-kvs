#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedStorage} from "../";

const TITLE = __filename.split("/").pop();
const WAIT = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

describe(TITLE, () => {
    it("maxItems", async () => {
        const store = new TimedStorage<string>({maxItems: 5});

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
        await WAIT(1001);

        // this refreshes "foo" and removes "bar" then
        assert.equal(cache("foo"), "foo:7"); // refreshed
        assert.equal(cache("foo"), "foo:7"); // cached

        // assert.equal(COUNT("bar"), "bar:8"); // removed
        assert.equal(cache("buz"), "buz:3");

        assert.equal(cache("buz"), "buz:3");
        assert.equal(cache("qux"), "qux:4");
        assert.equal(cache("quux"), "quux:5");
    });
});