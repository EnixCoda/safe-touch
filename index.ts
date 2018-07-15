export interface ProxyHandler<T> {
  get?<K extends keyof T>(target: () => T, p: K): T[K] & Callable<T[K]>
  apply?(): T
}

const noop = () => undefined

export interface ProxyConstructor<T> {
  new (noop: Function, handler: ProxyHandler<T>): T & Callable<T>
}

const blackHole: any = new Proxy(noop, {
  get: () => blackHole,
  apply: noop,
})

interface Callable<T> {
  ():T
}

export default function safeTouch<T>(source: T): T & Callable<T> {
  if (source === undefined) return blackHole
  return new (<ProxyConstructor<T>>Proxy)(noop, {
    apply: () => source,
    get: (_, key) => {
      if (source !== null && Object.prototype.hasOwnProperty.call(source, key)) return safeTouch(source[key])
      return blackHole
    },
  })
}
