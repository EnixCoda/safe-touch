interface Callable<T> {
    (): T | undefined;
    <K>(fallback?: K): K extends T ? K : T | undefined;
}
declare type MixProps<T> = T extends undefined ? undefined : {
    readonly [P in keyof T]-?: Mix<T[P]>;
};
declare type Mix<T> = Callable<T> & MixProps<T>;
export declare function safeTouch<T>(source: T): Mix<T>;
export default safeTouch;
