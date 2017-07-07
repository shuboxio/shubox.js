"use strict";
exports.__esModule = true;
function mergeObject() {
    var target = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        target[_i] = arguments[_i];
    }
    var builtHash = {};
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                builtHash[key] = arg[key];
            }
        }
    }
    return builtHash;
}
exports.mergeObject = mergeObject;
