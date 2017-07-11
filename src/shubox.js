"use strict";
/// <reference types="../typings/shubox"/>
exports.__esModule = true;
var fetch_setup_1 = require("./lib/fetch_setup");
var Shubox = (function () {
    function Shubox(selector) {
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.defaultOptions = {
            success: function (file) { },
            error: function (file, error) { },
            textBehavior: 'replace',
            s3urlTemplate: '{{s3url}}',
            acceptedFiles: 'image/*',
            clickable: true,
            previewsContainer: null,
            dictMaxFilesExceeded: "Your file limit of {{maxFiles}} file(s) has been reached.",
            maxFiles: null,
            extraParams: {}
        };
        this.selector = selector;
        fetch_setup_1.fetchSetup(window);
    }
    return Shubox;
}());
exports.Shubox = Shubox;
