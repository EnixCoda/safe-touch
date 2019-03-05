interface Callable<T> {
    (fallback?: T): T | undefined;
}
declare type MixProps<T> = T extends undefined ? undefined : {
    readonly [P in keyof T]-?: Mix<T[P]>;
};
declare type Mix<T> = Callable<T> & MixProps<T>;
export declare function safeTouch<T>(source: T): Mix<T>;
export default safeTouch;
