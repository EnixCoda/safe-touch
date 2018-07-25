const safeTouch = require('../lib').default

function testMultipleTimes(method, times) {
  const start = Date.now()
  for(let i = 0; i < times; ++i) {
    method()
  }
  const end = Date.now()
  return {
    duration: end - start,
    start,
    end,
  }
}

function logRetrieveMethods(retrieveMethods) {
  console.log('Will test with these retrieve methods:')
  retrieveMethods.forEach(retrieveMethod => console.log(`  ${retrieveMethod.toString()}`))
  console.log('\n')
}

function test(description, testTypes, retrieveMethods, testSamples, times) {
  console.log(`
***********************************************************
${description}
Will run ${times.toLocaleString()} times for each test case.
  `)
  logRetrieveMethods(retrieveMethods)

  const testCases = []
  testSamples.forEach(({ name, value }) => {
    testCases.push(`Testing on ${name}: ${JSON.stringify(value)}`)
    testTypes.forEach(testType => {
      testCases.push(`  By ${testType.name}`)
      retrieveMethods.forEach(retrieveMethod => {
        testCases.push({ retrieveMethod, testType, value, times })
      })
      testCases.push('')
    })
    testCases.push('')
  })

  testCases.forEach(testCase => {
    if (typeof testCase === 'object') {
      const { retrieveMethod, testType, value, times } = testCase
      const { duration } = testMultipleTimes(() => testType(value, retrieveMethod), times)
      console.log('    ', retrieveMethod.name.padEnd(20, ' '), 'took', duration.toLocaleString().padStart(5, ' '), 'ms')
    } else {
      console.log(testCase)
    }
  })
}

function noProtections(source, retrieve) {
  return retrieve(source)
}

function protectByTryCatch(source, retrieve) {
  try {
    return retrieve(source)
  } catch (err) {
    return undefined
  }
}

function protectBySafeTouch(source, retrieve) {
  return retrieve(safeTouch(source))
}

function impossibleRetrieve(_) { return _[Math.random()][Math.random()] }
function shallowRetrieve(_) { return _.key }
function deepRetrieve(_) { return _.a.b.c.d.e.f.g.h.i }
function deepChainedRetrieve(_) { return _.a && _.a.b && _.a.b.c && _.a.b.c.d && _.a.b.c.d.e && _.a.b.c.d.e.f && _.a.b.c.d.e.f.g && _.a.b.c.d.e.f.g.h && _.a.b.c.d.e.f.g.h.i }

/* **************************************************************************************** */

test(
  'try...catch VS safe-touch',
  [
    protectByTryCatch,
    protectBySafeTouch,
  ],
  [
    impossibleRetrieve,
    shallowRetrieve,
    deepRetrieve,
  ],
  [
    {
      name: 'Normal Empty Object',
      value: {},
    },
    {
      name: 'Deep Object',
      value: { a: { b: { c: { d: { e: { f: { g: { h: { i: true } } } } } } } } },
    },
    {
      name: 'Object.create(null)',
      value: Object.create(null),
    },
    {
      name: 'null',
      value: null,
    },
    {
      name: 'undefined',
      value: undefined,
    },
  ],
  Math.pow(10, 5),
)

test(
  'safe-touch VS chained',
  [
    noProtections,
    protectBySafeTouch,
  ],
  [
    deepRetrieve,
    deepChainedRetrieve,
  ],
  [
    {
      name: 'Deep Object',
      value: { a: { b: { c: { d: { e: { f: { g: { h: { i: true } } } } } } } } },
    },
  ],
  Math.pow(10, 5),
)
