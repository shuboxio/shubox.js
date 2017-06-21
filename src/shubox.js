"use strict";
exports.__esModule = true;
var fetch_setup_1 = require("../src/lib/fetch_setup");
var Shubox = (function () {
    function Shubox(selector) {
        this.selector = selector;
        fetch_setup_1.fetchSetup(window);
    }
    return Shubox;
}());
exports.Shubox = Shubox;
