interface Callable<T> {
  (): T | undefined
}

type MixProps<T> = {
  readonly [P in keyof T]: Mix<T[P]>
}

type Mix<T> = Callable<T> & MixProps<T>

interface MyProxyHandler<T> {
  get?<K extends keyof T> (target: T, p: K): Mix<T[K]>
  apply? (): T
}

interface MyProxyConstructor<T> {
  new (target: Function, handler: MyProxyHandler<T>): Mix<T>
}

function noop() {}

const wormHole:any = new (<MyProxyConstructor<any>>Proxy)(noop, {
  get() { return wormHole },
  apply: noop,
})

export default function safeTouch<T>(source: T): Mix<T> {
  if (source === undefined) return wormHole
  return new (<MyProxyConstructor<T>>Proxy)(noop, {
    apply: () => source,
    get: (_, key) => {
      if (source !== null && Object.prototype.hasOwnProperty.call(source, key)) return safeTouch(source[key])
      return wormHole
    },
  })
}
