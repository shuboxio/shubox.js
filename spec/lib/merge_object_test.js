"use strict";
exports.__esModule = true;
var Chai = require("chai");
var merge_object_1 = require("../../src/lib/merge_object");
var expect = Chai.expect;
describe('mergeObject', function () {
    it('returns a merged object literal', function () {
        var result = merge_object_1.mergeObject({}, { first_name: 'Joel' }, { last_name: 'Oliveira' });
        expect(result).to.deep.equal({
            first_name: 'Joel',
            last_name: 'Oliveira'
        });
    });
});
