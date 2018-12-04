interface Callable<T> {
    (): T | undefined;
}
declare type MixProps<T> = {
    readonly [P in keyof T]: Mix<T[P]>;
};
declare type Mix<T> = Callable<T> & MixProps<T>;
export default function safeTouch<T>(source: T): Mix<T>;
export {};
