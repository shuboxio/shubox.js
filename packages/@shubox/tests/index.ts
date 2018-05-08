import * as Chai from 'chai';
import {setupJsDom, teardownJsDom} from './test_helper';
import {Shubox} from 'shubox';

const expect = Chai.expect;

describe('Shubox', () => {
  describe('.instances', () => {
    beforeEach(done => {
      setupJsDom(() => {
        done();
      });
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('holds onto all instances of shubox on a page', () => {
      new Shubox('.upload');

      expect(Shubox.instances.length).to.equal(2);
    });
  });
});
