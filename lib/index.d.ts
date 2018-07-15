export interface ProxyHandler<T> {
    get?<K extends keyof T>(target: () => T, p: K): T[K] & Callable<T[K]>;
    apply?(): T;
}
export interface ProxyConstructor<T> {
    new (noop: Function, handler: ProxyHandler<T>): T & Callable<T>;
}
interface Callable<T> {
    (): T;
}
export default function safeTouch<T>(source: T): T & Callable<T>;
export {};
