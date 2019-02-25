"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function noop() { }
const wormHole = new Proxy(noop, {
    get() {
        return wormHole;
    },
    apply: noop,
});
function safeTouch(source) {
    if (source === undefined)
        return wormHole;
    return new Proxy(noop, {
        apply: () => source,
        get: (_, key) => {
            if (source !== null && Object.prototype.hasOwnProperty.call(source, key))
                return safeTouch(source[key]);
            return wormHole;
        },
    });
}
exports.default = safeTouch;
