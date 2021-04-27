#!/usr/bin/env bash -c make

all: dist ../build/test.js

# dist/*.min.js uses ES5
../dist/timed-kvs.min.js: ../build/timed-kvs.bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m -o $@ $<

../build/timed-kvs.bundle.js: ../build/timed-kvs.amd.js wrap.js
	grep -v '// END' < wrap.js > $@
	cat $< >> $@
	grep '// END' < wrap.js >> $@
	perl -i -pe 's#^ *("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@
	perl -i -pe 's#_super\.prototype\.#__super.#g; s#function \(_super\) \{#$$& var __super = _super.prototype;#' $@

../build/timed-kvs.amd.js: ../lib/*.ts
	../node_modules/.bin/tsc -p .

# build/test/*.js uses ES6
../build/test.js: ../dist/timed-kvs.min.js ../test/*.ts
	../node_modules/.bin/tsc -p ..
	mkdir -p ../build/test
	cp -p ../test/[1-7][0-9].*.js ../build/test
	perl -i -pe 's#require\("../(lib/timed-kvs)?"\)#require("../../browser/import")#' ../build/test/*.js
	../node_modules/.bin/browserify -o $@ ../build/test/*.js

dist: ../dist/timed-kvs.min.js

clean:
	/bin/rm -fr ../build ../dist/*.js

test: ../build/test.js
	open ../browser/test.html

.PHONY: all clean test
