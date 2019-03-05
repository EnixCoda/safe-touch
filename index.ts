interface Callable<T> {
  (fallback?: T): T | undefined
}

type MixProps<T> = T extends undefined ? undefined : { readonly [P in keyof T]-?: Mix<T[P]> }

type Mix<T> = Callable<T> & MixProps<T>

interface MyProxyHandler<T> {
  get<K extends keyof T>(target: T, p: K): Mix<T[K]>
  apply(target: any, thisArg: any, argList: any[]): T
}

interface MyProxyConstructor<T> {
  new (target: Function, handler: MyProxyHandler<T>): Mix<T>
}

function applyWithFallback(original: any): MyProxyHandler<any>['apply'] {
  return function tryFallback(_, __, [fallback]) {
    return original === undefined ? fallback : original
  }
}

function noop() {}

// `var` for using `typeof {undefinedVariable}`
var wormHole = safeTouch(undefined)

export function safeTouch<T>(source: T): Mix<T> {
  if (source === undefined && typeof wormHole !== 'undefined') return wormHole as Mix<T>
  return new (<MyProxyConstructor<T>>Proxy)(noop, {
    apply: applyWithFallback(source),
    get: (_, key) => {
      if (
        source !== undefined &&
        source !== null &&
        Object.prototype.hasOwnProperty.call(source, key)
      )
        return safeTouch(source[key])
      return wormHole
    },
  })
}

export default safeTouch
