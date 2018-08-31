interface Callable<T> {
  (): T
}

interface ProxyHandler<T> {
  get?<K extends keyof T> (target: T, p: K): T[K] & Callable<T[K]>
  apply? (): T
}

interface ProxyConstructor<T> {
  new (target: Function, handler: ProxyHandler<T>): T & Callable<T>
}

function noop() {}

const wormHole:any = new (<ProxyConstructor<any>>Proxy)(noop, {
  get() { return wormHole },
  apply: noop,
})

export default function safeTouch<T>(source: T): T & Callable<T> {
  if (source === undefined) return wormHole
  return new (<ProxyConstructor<T>>Proxy)(noop, {
    apply: () => source,
    get: (_, key) => {
      if (source !== null && Object.prototype.hasOwnProperty.call(source, key)) return safeTouch(source[key])
      return wormHole
    },
  })
}
