"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop = () => undefined;
const blackHole = new Proxy(noop, {
    get: () => blackHole,
    apply: noop,
});
function safeTouch(source) {
    if (source === undefined)
        return blackHole;
    return new Proxy(noop, {
        apply: () => source,
        get: (_, key) => {
            if (source !== null && Object.prototype.hasOwnProperty.call(source, key))
                return safeTouch(source[key]);
            return blackHole;
        },
    });
}
exports.default = safeTouch;
