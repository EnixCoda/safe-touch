# Safe Touch

Retrieving deeply buried properties is a common problem in JavaScript, it could crash your application if you try to access a property that doesn't exist.

```js
const state = { user: { name: "EnixCoda" } };
console.log(state.user.name); // 'EnixCoda'
state.user = null;            // simulating logout
console.log(state.user.name); // Uncaught TypeError: Cannot read property 'name' of null
```

Safe touch is a safe way to access deeply buried properties.

```js
const $state = safeTouch(state);  // retrieving properties from $state is always safe
console.log($state() === state);  // true; invoke to get the original value
let { user: { name } } = $state;  // support native destructuring
console.log(name());              // 'EnixCoda'
console.log($state.user.name());  // 'EnixCoda'

state.user = null;                // simulating logout
let { user: { name } } = $state;  // support native destructuring
console.log(name());              // undefined; no errors!
console.log($state.user.name());  // undefined; no errors!
```

[Playground](https://codesandbox.io/s/safe-touch-playground-o96vi)

Available as `safe-touch` on [npm](https://www.npmjs.com/package/safe-touch).

```shell
> yarn add safe-touch
```

## Why choose Safe Touch?
- `state && state.user && state.user.name` is verbose.
- wrapping with `try ... catch` is verbose and creates new code block.
- lodash [`_.get`](https://lodash.com/docs/#get) has no TypeScript support.
