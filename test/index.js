const safeTouch = require('../lib').default

const normalObject = {
  existProperty: null,
}
const touched = safeTouch(normalObject)

log('Let\'s start with this normal object:', `
  const normalObject = {
    existProperty: null,
  }`)

log('Wrap it with safeTouch:', `
  import safeTouch from 'safe-touch'
  const touched = safeTouch(normalObject)`)

log(
  'Call it to get the original object.\n',
  '(touched() === normalObject) is',
  touched() === normalObject,
)

log(
  'You can get property of original object.\n',
  '(touched.existProperty() === normalObject.existProperty) is',
  normalObject.existProperty === touched.existProperty(),
)

log(
  'You can access non-exist property safely.\n',
  '(touched.go.deeper.even.random[Math.random()]() === undefined) is',
  touched.go.deeper.even.random[Math.random()]() === undefined
)

function log(...args) {
  console.log(...args, '\n')
}
