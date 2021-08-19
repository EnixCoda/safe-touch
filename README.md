# Safe Touch

> Touch deeply buried properties safely.

[Playground](https://codesandbox.io/s/safe-touch-playground-o96vi)

## The existing problem

Let's say you need to dig up some deeply buried properties from an object:

```js
const obj = { a: { b: true } };
const value1 = obj.a.b; // true
const value2 = obj.c.d; // Uncaught TypeError: Cannot read property 'd' of undefined (value2.c)
```

To prevent error, you might do such things:

```js
// 1. manually expanded chain
const value = obj && obj.c && obj.c.d && obj.c.d;
// 2. wrap in try-catch
try {
  const value = obj.c.d;
} catch (err) {}
```

Lodash provides [the get function](https://lodash.com/docs/4.17.15#get), which doesn't throw error, accepts a path in string:

```js
const value = require("lodash").get(obj, "c.d");
```

But it is not very straight forward, IDE and editor cannot autocomplete in it.

## Install

It's available as `safe-touch` on npm.

```
$ yarn add safe-touch
```

## How can `safe-touch` help

```js
import safeTouch from "safe-touch";

const obj = { a: { b: true } };

// Wrap it with safeTouch:
const safe = safeTouch(obj);

// Invoke to get the original value
safe() === obj; // true

// Invoke on property to get original property value
safe.a.b(); // true

// Access inexistent property safely
safe.c.d(); // undefined

// Return fallback value if got undefined
const fallback = 0;
safe.something.does.not.exist[Math.random()](fallback); // 0

// Support native destructuring
const {
  a: { b },
  c: { d },
} = safe;
b(); // true
d(); // undefined
```

### Intellisense

Thanks to type system, smart editors still recognizes wrapped and unwrapped variables.
![](https://user-images.githubusercontent.com/7480839/42639648-1b9d6d00-8623-11e8-81ec-2927913e56cb.png)

![](https://user-images.githubusercontent.com/7480839/42639650-1d8149a2-8623-11e8-9080-345b78d582d3.png)

## Alternatives

Optional chaining can solve the problem at language level during build time.

- [TC39 Proposal](https://github.com/tc39/proposal-optional-chaining)
- [TypeScript 3.7 implements optional chaining](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/#optional-chaining)
