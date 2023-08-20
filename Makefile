#!/usr/bin/env bash -c make

ALL=\
	dist/timed-kvs.cjs \
	dist/timed-kvs.mjs \
	dist/timed-kvs.min.js \
	build/test.js \

all: $(ALL)

# ES5 - CommonJS for browsers
dist/timed-kvs.min.js: dist/timed-kvs.cjs
	./node_modules/.bin/terser -c -m -o $@ $<

# test/*.js uses ES2021 with CommonJS
build/test.js: test/*.js
	./node_modules/.bin/browserify test/*.js \
		-t [ browserify-sed 's#require\("../(lib/timed-kvs)?"\)#require("../browser/import")#' ] --list | sort
	./node_modules/.bin/browserify -o $@ test/*.js \
		-t [ browserify-sed 's#require\("../(lib/timed-kvs)?"\)#require("../browser/import")#' ]

# ES2021 - ES Module
dist/timed-kvs.mjs: build/esm/timed-kvs.js
	./node_modules/.bin/rollup -f es -o $@ $^

dist/timed-kvs.cjs: build/es5/timed-kvs.js
	./node_modules/.bin/rollup -f iife -n "TimedKVS" -o $@ $^
	perl -i -pe 's#return exports;#return TimedKVS;#' $@
	perl -i -pe 's#^\}\)\(\{\}\);#})("undefined" !== typeof exports ? exports : {});#' $@

# ES2021 - CommonJS
test/%.js: test/%.ts
	./node_modules/.bin/tsc -p tsconfig.json

# ES5 - CommonJS
build/es5/%.js: lib/%.ts
	./node_modules/.bin/tsc -p tsconfig-es5.json
	perl -i -pe 's#this && this.__extends#false#' $@

# ES2021 - ES Module
build/esm/%.js: lib/%.ts
	./node_modules/.bin/tsc -p tsconfig-esm.json

clean:
	/bin/rm -fr $(ALL) build/

test: all
	./node_modules/.bin/mocha test/*.js
	node -e 'import("./dist/timed-kvs.mjs").then(x => new x.TimedKVS().get())'
	node -e 'const {TimedKVS} = require("./dist/timed-kvs.min.js"); new TimedKVS().get()'

.PHONY: all clean test
