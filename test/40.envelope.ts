#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

import {TimedKVS} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("setItem() getItem()", async () => {
        const store = new TimedKVS<string>();

        assert.equal(typeof store.getItem("foo"), "undefined");

        const bar = {value: "BAR"};
        store.setItem("bar", bar);
        assert.equal(typeof store.getItem("bar"), "object");
        assert.equal(store.getItem("bar").value, bar.value);

        const buz = {value: null as any};
        store.setItem("buz", buz);
        assert.equal(typeof store.getItem("buz"), "object");
        assert.equal(store.getItem("buz").value, buz.value);
    });
});
