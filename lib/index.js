"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function applyWithFallback(original) {
    return function tryFallback(_, __, [fallback]) {
        return original === undefined ? fallback : original;
    };
}
function noop() { }
// `var` for using `typeof {undefinedVariable}`
var wormHole = safeTouch(undefined);
function safeTouch(source) {
    if (source === undefined && typeof wormHole !== 'undefined')
        return wormHole;
    return new Proxy(noop, {
        apply: applyWithFallback(source),
        get: (_, key) => {
            if (source !== undefined &&
                source !== null &&
                Object.prototype.hasOwnProperty.call(source, key))
                return safeTouch(source[key]);
            return wormHole;
        },
    });
}
exports.safeTouch = safeTouch;
exports.default = safeTouch;
