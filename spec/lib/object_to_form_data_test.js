"use strict";
exports.__esModule = true;
var Chai = require("chai");
var object_to_form_data_1 = require("../../src/lib/object_to_form_data");
var spec_helper_1 = require("../spec_helper");
var expect = Chai.expect;
describe('objectToFormData', function () {
    beforeEach(function (done) {
        spec_helper_1.setupJsDom(function () { return done(); });
    });
    afterEach(function () {
        spec_helper_1.teardownJsDom();
    });
    it('returns a FormData object made from a hash object', function () {
        var expectedFormData = new window.FormData();
        expectedFormData.append("name", "joel");
        expectedFormData.append("city", "boston");
        var result = object_to_form_data_1.objectToFormData({
            name: 'joel',
            city: 'boston'
        });
        expect(result).to.deep.equal(expectedFormData);
    });
    it('works with a nested hash', function () {
        var expectedFormData = new window.FormData();
        expectedFormData.append("name[first]", "joel");
        expectedFormData.append("name[last]", "oliveira");
        expectedFormData.append("city", "boston");
        var result = object_to_form_data_1.objectToFormData({
            name: {
                first: 'joel',
                last: 'oliveira'
            },
            city: 'boston'
        });
        expect(result).to.deep.equal(expectedFormData);
    });
});
