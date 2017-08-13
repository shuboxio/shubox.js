import * as Chai from 'chai';
import {setupJsDom, teardownJsDom} from './spec_helper';
import {Shubox} from '../src/shubox';

const expect = Chai.expect;

describe('Shubox', () => {
  describe('.instances', () => {
    beforeEach(done => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('holds onto all instances of shubox on a page', () => {
      Shubox.instances = [new Shubox('div'), new Shubox('.upload')];
    });
  });
});
