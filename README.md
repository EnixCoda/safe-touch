# Safe Touch

> Touch deeply buried property safely with ease.

## The existing problem

If you need to dig up some deeply buried properties in an object:

```js
const value = someObject.key1.key2.key3
```

If we try to make it safer:

```js
const value = someObject && someObject.key1 && someObject.key1.key2 && someObject.key1.key2.key3
// or
try {
  const value = someObject.key1.key2.key3
} catch(err) {
  // ...
}
```

Ugly.

Lodash provides `get` method to help, won't throw error:
```js
import _ from 'lodash'
const value = _.get(someObject, 'key1.key2.key3')
```

But we cannot use destructuring here. Also, path of the property is written as string, IDEs and editors cannot autocomplete it.

## How would this tool help you

```js
import safeTouch from 'safe-touch'

// Create an ordinary object to help introduction
const normalObject = {
  existingProperty: null,
}

// Wrap it with safeTouch:
const touched = safeTouch(normalObject)

// Call to get the original object
touched() === normalObject // true

// Call to get property of original object
touched.existingProperty() // null

// Access not existing property path safely
touched.something.does.not.exist[Math.random()]() // undefined

// Destructuring
const { key1: { key2: { key3 } } } = normalObject
key3() // undefined
```

### Intellisense
Ordinary intellisense for object.
![](https://user-images.githubusercontent.com/7480839/42639648-1b9d6d00-8623-11e8-81ec-2927913e56cb.png)

Thanks to typings, smart editor could help you even after wrapping it.
![](https://user-images.githubusercontent.com/7480839/42639650-1d8149a2-8623-11e8-9080-345b78d582d3.png)
