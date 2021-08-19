interface SafeCallable<T> {
  (): T | undefined;
  <K>(fallback: K): T extends undefined ? K : K | T;
}

type SafeProps<T> = { readonly [P in keyof T]-?: SafeTouch<T[P]> };
type Safe<T> = SafeProps<T> & SafeCallable<T>;
type SafeTouch<T> = T extends undefined | number | boolean
  ? SafeProps<any> & SafeCallable<undefined>
  : Safe<T>;

interface SafeProxyHandler<T> {
  get<K extends keyof T>(target: T, p: K): SafeTouch<T[K]>;
  apply(target: any, thisArg: any, argList: any[]): T;
}

function applyWithFallback<T>(original: T): SafeProxyHandler<T>["apply"] {
  return function tryFallback(_, __, [fallback]) {
    return original === undefined ? fallback : original;
  };
}

function noop() {}

// Using var to prevent circular referencing error on the first call
var blackHole = touch(undefined);

function touch(source?: undefined): SafeTouch<any>;
function touch<T>(source: T): SafeTouch<T>;

function touch(source: any) {
  if (typeof source === "undefined" && typeof blackHole !== "undefined")
    return blackHole;
  return new Proxy(noop, {
    apply: applyWithFallback(source),
    get: (_, key) => {
      if (
        source !== undefined &&
        source !== null &&
        Object.prototype.hasOwnProperty.call(source, key)
      )
        return touch(source[key]);
      return blackHole;
    },
  });
}

export const safeTouch = touch;

export default touch;
