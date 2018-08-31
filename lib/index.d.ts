interface Callable<T> {
    (): T;
}
export default function safeTouch<T>(source: T): T & Callable<T>;
export {};
