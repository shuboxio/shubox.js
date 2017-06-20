"use strict";
exports.__esModule = true;
var jsdom = require("jsdom/lib/old-api.js");
function setupJsDom(onInit) {
    jsdom.env({
        html: '<!DOCTYPE html><html><head></head><body></body></html>',
        features: {
            FetchExternalResources: ['script'],
            ProcessExternalResources: ['script'],
            MutationEvents: '2.0',
            QuerySelector: false
        },
        done: function (err, window) {
            global.window = window;
            global.document = window.document;
            if (onInit) {
                onInit();
            }
        }
    });
}
exports.setupJsDom = setupJsDom;
function teardownJsDom() {
    delete global.window;
    delete global.document;
}
exports.teardownJsDom = teardownJsDom;
