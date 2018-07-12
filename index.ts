export interface ProxyHandler<T> {
  get?<K extends keyof T>(target: () => T, p: K): T[K] & Callable<T[K]>
  apply?(): T
}

export interface ProxyConstructor {
  new <T>(target: () => T, handler: ProxyHandler<T>): T & Callable<T>
}

const noop = () => undefined

const blackHole: any = new Proxy(noop, {
  get: () => blackHole,
  apply: noop,
})

interface Callable<T> {
  ():T
}

export default function safeTouch<T>(source: T): T & Callable<T> {
  if (typeof source !== 'object' || source === null) return blackHole
  const apply = () => source
  const proxy = new (<ProxyConstructor>Proxy)(apply, {
    apply,
    get: (_, key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) return safeTouch(source[key])
      return blackHole
    },
  })
  return proxy
}
