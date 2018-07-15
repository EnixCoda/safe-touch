const safeTouch = require('../lib').default

const normalObject = {
  existProperty: null,
  whatsThis() {
    return this
  },
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
  touched.go.deeper.even.random[Math.random()]() === undefined,
)

log(
  'What happens with functions?\n',
  `normalObject.whatsThis = function () { return this }`,
  'Access function property will NOT preserve `this`.\n',
  'Does (touched.whatsThis()()) equal to normalObject.whatsThis()?',
  touched.whatsThis()() === normalObject.whatsThis(),
)

log('---------------------------------------------------------------')

~[
  ['empty string', ''],
  ['normal string', 'str'],
  ['number 0', 0],
  ['number 1', 1],
  ['NaN', NaN],
  ['Infinity', Infinity],
  ['null', null],
  ['undefined', undefined],
  ['RegExp', /d/],
  ['Array', []],
  ['log function', log],
].forEach(typeCheck)

log('---------------------------------------------------------------')

function log(...args) {
  console.log(...args, '\n')
}

function typeCheck([name, v]) {
  const vv = safeTouch(v)
  const evaluated = vv()
  const vf = `${evaluated}` === ''
    ? JSON.stringify(evaluated)
    : evaluated
  log(vv[Math.random()]() === undefined && 'safely', 'accessed', `${name},`, 'got', `(${vf})`, '.')
}
