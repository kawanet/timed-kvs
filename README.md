# timed-kvs

Lightweight Key-value storage with built-in TTL expiration management

[![Node.js CI](https://github.com/kawanet/timed-kvs/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/timed-kvs/actions/)
[![npm version](https://badge.fury.io/js/timed-kvs.svg)](https://www.npmjs.com/package/timed-kvs)
[![gzip size](https://img.badgesize.io/https://unpkg.com/timed-kvs/dist/timed-kvs.min.js?compression=gzip)](https://unpkg.com/timed-kvs/dist/timed-kvs.min.js)

## SYNOPSIS

```js
const {TimedKVS} = require("timed-kvs");

const store = new TimedKVS({expires: 60000, maxItems: 1000});

store.set("foo", "FOO");

store.get("foo"); // => "FOO"

store.delete("foo");
```

See TypeScript declaration
[timed-kvs.d.ts](https://github.com/kawanet/timed-kvs/blob/main/types/timed-kvs.d.ts)
for more details.

## ES MODULE

```js
import {TimedKVS} from "timed-kvs";
```

## BROWSERS

Less than 3KB minified build available for Web browsers.

- https://cdn.jsdelivr.net/npm/timed-kvs/dist/timed-kvs.min.js

```html
<script src="https://cdn.jsdelivr.net/npm/timed-kvs/dist/timed-kvs.min.js"></script>
<script>
  const store = new TimedKVS({expires: 60000, maxItems: 1000});
  store.set("foo", "FOO");
  store.get("foo"); // => "FOO"
  store.delete("foo");
</script>
```

## LINKS

- https://github.com/kawanet/timed-kvs
- https://www.npmjs.com/package/timed-kvs
- https://www.npmjs.com/package/async-cache-queue

## MIT LICENSE

Copyright (c) 2020-2023 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
