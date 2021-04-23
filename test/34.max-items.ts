#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedStorage} from "../";

const TESTNAME = __filename.replace(/^.*\//, "");
const WAIT = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

describe(TESTNAME, () => {
    it("maxItems", async () => {
        const store = new TimedStorage<number>({maxItems: 5});

        let counter = 0;
        const COUNT = (num: number) => {
            const key = "" + num;
            const prev = store.get(key);
            if (prev) return prev;
            const val = num + (++counter);
            store.set(key, val);
            return val;
        };

        assert.equal(COUNT(100), 101);
        assert.equal(COUNT(200), 202);
        assert.equal(COUNT(300), 303);
        assert.equal(COUNT(400), 404);
        assert.equal(COUNT(500), 505);

        // check cached values
        assert.equal(COUNT(100), 101); // cached
        assert.equal(COUNT(200), 202);
        assert.equal(COUNT(300), 303);
        assert.equal(COUNT(400), 404);
        assert.equal(COUNT(500), 505);

        // this exceeds maxItems limit and removes 100 then
        assert.equal(COUNT(600), 606);
        assert.equal(COUNT(600), 606); // cached

        // wait a moment for garbage collection completed
        await WAIT(10);

        // this refreshes 100 and removes 200 then
        assert.equal(COUNT(100), 107); // refreshed

        // check cached values
        assert.equal(COUNT(100), 107); // cached
        // assert.equal(COUNT(200), 202); // removed
        assert.equal(COUNT(300), 303);
        assert.equal(COUNT(400), 404);
        assert.equal(COUNT(500), 505);
        assert.equal(COUNT(600), 606);
    });
});
