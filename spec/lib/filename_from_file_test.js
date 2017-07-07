"use strict";
exports.__esModule = true;
var Chai = require("chai");
var filename_from_file_1 = require("../../src/lib/filename_from_file");
var spec_helper_1 = require("../spec_helper");
var expect = Chai.expect;
var PastedFile = (function () {
    function PastedFile(parts, name) {
        this.parts = parts;
        this.name = name;
    }
    return PastedFile;
}());
describe('filenameFromFile', function () {
    beforeEach(function (done) {
        spec_helper_1.setupJsDom(function () { return done(); });
    });
    afterEach(function () {
        spec_helper_1.teardownJsDom();
    });
    it('returns the current existing filename', function () {
        var file = new window.File([""], "file.jpg");
        expect(filename_from_file_1.filenameFromFile(file)).to.equal('file.jpg');
    });
    it('returns a filename using current date time', function () {
        var file = new PastedFile([""], null);
        var now = new Date('2015-03-23T12:00:00');
        var expectedFilename = 'paste-23.03.2015-12.00.00.jpg';
        expect(filename_from_file_1.filenameFromFile(file, now)).to.equal(expectedFilename);
    });
});
