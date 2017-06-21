!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Shubox=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function fetchSetup(window) {
    if (!window.fetch) {
        var fetchJs = document.createElement('script');
        fetchJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js';
        fetchJs.id = 'fetch_script';
        document.head.appendChild(fetchJs);
    }
    if (!window.Dropzone) {
        var dropzoneJs = document.createElement('script');
        dropzoneJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.1.0/min/dropzone.min.js';
        dropzoneJs.id = 'dropzone_script';
        document.head.appendChild(dropzoneJs);
    }
}
exports.fetchSetup = fetchSetup;

},{}],2:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var fetch_setup_1 = _dereq_("../src/lib/fetch_setup");
var Shubox = (function () {
    function Shubox(selector) {
        this.selector = selector;
        fetch_setup_1.fetchSetup(window);
    }
    return Shubox;
}());
exports.Shubox = Shubox;

},{"../src/lib/fetch_setup":1}]},{},[2])
(2)
});