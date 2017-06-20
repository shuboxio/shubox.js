/// <reference path="../../typings/globals/mocha/index.d.ts" />
import { fetchSetup } from '../../src/lib/fetch_setup';
import * as Chai from 'chai';
import { setupJsDom, teardownJsDom } from '../spec_helper';

const expect = Chai.expect;
declare var Promise: any;

describe('FetchSetup', () => {
  describe('.run()', () => {
    beforeEach((done) => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('injects fetch script tag to the dom', () => {
      fetchSetup(window);

      let fetchScript = document.getElementById('fetch_script');
      let dropzoneScript = document.getElementById('dropzone_script');

      expect(fetchScript).to.exist;
      expect(dropzoneScript).to.exist;
    });

    it('does not add script if fetch exists', () => {
      let fakeWindow = {
        'fetch':    () => { return new Promise(); },
        'Dropzone': () => { return true; }
      }

      fetchSetup(fakeWindow);

      let fetchScript = document.getElementById('fetch_script');
      let dropzoneScript = document.getElementById('dropzone_script');

      expect(fetchScript).not.to.exist;
      expect(dropzoneScript).not.to.exist;
    })
  });
});
