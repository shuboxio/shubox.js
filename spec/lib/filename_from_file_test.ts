import * as Chai from 'chai';
import { filenameFromFile } from '../../src/lib/filename_from_file';
import { setupJsDom, teardownJsDom } from '../spec_helper';
const expect = Chai.expect;

class PastedFile {
  public parts: any[];
  public name: null | string;

  public constructor(parts: any[], name: null | string) {
    this.parts = parts;
    this.name = name;
  }
}

describe('filenameFromFile', () => {
  beforeEach((done) => {
    setupJsDom(() => done());
  });

  afterEach(() => {
    teardownJsDom();
  });

  it('returns the current existing filename', () => {
    const file = new (<any>window).File([""], "file.jpg");

    expect(filenameFromFile(file)).to.equal('file.jpg');
  })

  it('returns a filename using current date time', () => {
    const file = new PastedFile([""], null);
    const now = new Date('2015-03-23T12:00:00');
    const expectedFilename = 'paste-23.03.2015-12.00.00.jpg'

    expect(filenameFromFile(file, now)).to.equal(expectedFilename);
  })
})
