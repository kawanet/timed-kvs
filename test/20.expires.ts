#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedKVS} from "../";

const TITLE = __filename.split("/").pop();
const WAIT = (ms: number) => new Promise(resolve => setTimeout(() => resolve(ms), ms));

describe(TITLE, () => {
    it("expires", async () => {
        const store = new TimedKVS<string>({expires: 100});

        store.set("foo", "foo:1");
        assert.equal(store.get("foo"), "foo:1");

        await WAIT(200);
        assert.equal(typeof store.get("foo"), "undefined");

        store.set("foo", "foo:2");
        assert.equal(store.get("foo"), "foo:2");
    });
});
