"use strict";
exports.__esModule = true;
/// <reference path="../../typings/globals/mocha/index.d.ts" />
var fetch_setup_1 = require("../../src/lib/fetch_setup");
var Chai = require("chai");
var spec_helper_1 = require("../spec_helper");
var expect = Chai.expect;
describe('FetchSetup', function () {
    describe('.run()', function () {
        beforeEach(function (done) {
            spec_helper_1.setupJsDom(function () { return done(); });
        });
        afterEach(function () {
            spec_helper_1.teardownJsDom();
        });
        it('injects fetch script tag to the dom', function () {
            fetch_setup_1.fetchSetup(window);
            var fetchScript = document.getElementById('fetch_script');
            var dropzoneScript = document.getElementById('dropzone_script');
            expect(fetchScript).to.exist;
            expect(dropzoneScript).to.exist;
        });
        it('does not add script if fetch exists', function () {
            var fakeWindow = {
                'fetch': function () { return new Promise(); },
                'Dropzone': function () { return true; }
            };
            fetch_setup_1.fetchSetup(fakeWindow);
            var fetchScript = document.getElementById('fetch_script');
            var dropzoneScript = document.getElementById('dropzone_script');
            expect(fetchScript).not.to.exist;
            expect(dropzoneScript).not.to.exist;
        });
    });
});
