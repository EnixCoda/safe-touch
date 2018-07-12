"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop = () => undefined;
const blackHole = new Proxy(noop, {
    get: () => blackHole,
    apply: noop,
});
function safeTouch(source) {
    if (typeof source !== 'object' || source === null)
        return blackHole;
    const apply = () => source;
    const proxy = new Proxy(apply, {
        apply,
        get: (_, key) => {
            if (Object.prototype.hasOwnProperty.call(source, key))
                return safeTouch(source[key]);
            return blackHole;
        },
    });
    return proxy;
}
exports.default = safeTouch;
