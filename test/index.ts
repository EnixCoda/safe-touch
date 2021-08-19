import { safeTouch } from "..";

const normalObject = {
  existProperty: 1,
  zero: 0,
  whatsThis() {
    return this;
  },
};
const touched = safeTouch(normalObject);

console.log(`
Let's start with this normal object:
  const normalObject = { existProperty: null }

Wrap it with safeTouch:
  import safeTouch from 'safe-touch'
  const touched = safeTouch(normalObject)
`);

console.log(`
Call to get the original object.
${formatTF(touched() === normalObject)} touched() === normalObject
`);

console.log(`
You can get property of original object.
${formatTF(
  normalObject.existProperty === touched.existProperty()
)} touched.existProperty() === normalObject.existProperty
`);

console.log(`
You can access non-exist property safely.
${formatTF(
  (touched as any).go.deeper.even.random[Math.random()]() === undefined
)} touched.go.deeper.even.random[Math.random()]() === undefined
`);

console.log(`
What happens with functions?
  normalObject.whatsThis = function () { return this }
Access function property will NOT❎ preserve 'this'
${formatTF(
  touched.whatsThis()?.() !== normalObject.whatsThis()
)}  touched.whatsThis()() !== normalObject.whatsThis()
`);

console.log("---------------------------------------------------------------");

const cases: [string, unknown][] = [
  ["empty string", ""],
  ["normal string", "str"],
  ["number 0", 0],
  ["number 1", 1],
  ["NaN", NaN],
  ["Infinity", Infinity],
  ["null", null],
  ["undefined", undefined],
  ["RegExp", /d/],
  ["Array", []],
  ["function", function func() {}],
];
cases.forEach(typeCheck);

function formatTF(trueOrFalse: boolean) {
  return trueOrFalse ? "✅" : "❌";
}

function typeCheck([name, v]: [string, any]) {
  const vv = safeTouch(v);
  const evaluated = vv();
  const vf =
    `${evaluated}` === ""
      ? JSON.stringify(evaluated)
      : typeof evaluated === "string"
      ? `"${evaluated}"`
      : evaluated;
  console.log(
    formatTF(vv[Math.random()]() === undefined),
    "accessed",
    `${name} (${vf})`
  );
}

console.log("---------------------------------------------------------------");

console.log("Testing fallback values\n");

function expectValue(
  evalString: string,
  expectedValue: unknown,
  evaluate = () => eval(evalString)
) {
  console.log(
    evalString,
    `should be`,
    expectedValue,
    formatTF(expectedValue === evaluate())
  );
}

expectValue(`touched.existProperty()`, 1);
expectValue(`touched.existProperty(2)`, 1);
expectValue(`touched.existProperty(0)`, 1);
expectValue(`touched.nonExistProperty()`, undefined);
expectValue(`touched.nonExistProperty(0)`, 0);
expectValue(`safeTouch(0)()`, 0, () => safeTouch(0)());
expectValue(`safeTouch(0)(1)`, 0, () => safeTouch(0)(1));
expectValue(`safeTouch(false)()`, false, () => safeTouch(false)());
expectValue(`safeTouch(false)(true)`, false, () => safeTouch(false)(true));
expectValue(`safeTouch()[Math.random()](1)`, 1, () => safeTouch()[Math.random()](1));

console.log("---------------------------------------------------------------");
