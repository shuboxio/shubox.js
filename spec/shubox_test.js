"use strict";
exports.__esModule = true;
var Chai = require("chai");
var spec_helper_1 = require("./spec_helper");
var shubox_1 = require("../src/shubox");
var expect = Chai.expect;
describe('Shubox', function () {
    describe('.instances', function () {
        beforeEach(function (done) {
            spec_helper_1.setupJsDom(function () { return done(); });
        });
        afterEach(function () {
            spec_helper_1.teardownJsDom();
        });
        it('holds onto all instances of shubox on a page', function () {
            shubox_1.Shubox.instances = [new shubox_1.Shubox('div'), new shubox_1.Shubox('.upload')];
        });
    });
});
