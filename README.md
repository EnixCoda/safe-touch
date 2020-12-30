# Safe Touch

> Touch deeply buried property safely with ease. This is like optional chaining at runtime.

[Playground](https://stackblitz.com/edit/play-safe-touch)

It is available as `safe-touch` on npm.

## The existing problem

Sometimes we dig up deeply buried properties:

```js
const value = someObject.key1.key2.key3
```

An error will be thrown if any value in the middle of the chain is falsy, i.e. `Uncaught TypeError: Cannot read property of undefined`

If we try to make it safer, code become verbose.

```js
const value = someObject && someObject.key1 && someObject.key1.key2 && someObject.key1.key2.key3
// or
try {
  const value = someObject.key1.key2.key3
} catch (err) {
  // ...
}
```

Lodash provides a `get` method to help, it won't throw error:

```js
import _ from 'lodash'
const value = _.get(someObject, 'key1.key2.key3')
```

But we cannot use destructuring here. Also, path of the property is written as string, IDEs and editors cannot autocomplete it.

## How can `safe-touch` help you

```js
import safeTouch from 'safe-touch'

// Create a sample object for introduction
const normalObject = {
  existingProperty: null,
}

// Wrap it with safeTouch:
const touched = safeTouch(normalObject)

// Call to get the original object
touched() === normalObject // true

// Call to get property of original object
touched.existingProperty() // null

// Access inexistent property path safely
touched.something.does.not.exist[Math.random()]() // undefined

// Return fallback value if got undefined
const fallback = 0
touched.something.does.not.exist[Math.random()](fallback) // 0

// Destructuring
const {
  key1: {
    key2: { key3 },
  },
} = touched
key3() // undefined
```

### Intellisense

Thanks to typings, smart editors still recognizes wrapped variables.
![](https://user-images.githubusercontent.com/7480839/42639648-1b9d6d00-8623-11e8-81ec-2927913e56cb.png)

You'll still get autocompletion after retrieving the original object.
![](https://user-images.githubusercontent.com/7480839/42639650-1d8149a2-8623-11e8-9080-345b78d582d3.png)

## Alternatives
Optional chaining can solve the problem at language-level, see:

- [TC39 Proposal](https://github.com/tc39/proposal-optional-chaining)
- [TypeScript 3.7 implements optional chaining](https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/#optional-chaining)
