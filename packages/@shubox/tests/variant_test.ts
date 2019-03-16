import * as Chai from 'chai';
import {Variant} from '../core/src/variant';

const expect = Chai.expect;

export interface ShuboxFile {
  s3url: string
}

describe('Variant', () => {
  describe('#url', () => {
    it('returns a url with the correct variant', () => {
      const shuboxFile = { s3url: 'http://s3.com/image.jpg' } as ShuboxFile;
      const hashVariant = new Variant(shuboxFile, '200x200#').url();
      const caratVariant = new Variant(shuboxFile, '200x200^').url();
      const bangVariant = new Variant(shuboxFile, '200x200!').url();

      expect(hashVariant).to.equal('http://s3.com/200x200_hash_image.jpg');
      expect(caratVariant).to.equal('http://s3.com/200x200_carat_image.jpg');
      expect(bangVariant).to.equal('http://s3.com/200x200_bang_image.jpg');
    });

    it('returns another format of the file', () => {
      const shuboxFile = { s3url: 'http://s3.com/image.gif' } as ShuboxFile;
      const mp4 = new Variant(shuboxFile, '.mp4').url();

      expect(mp4).to.equal('http://s3.com/image.gif.mp4');
    });

    it('returns both the prefix and file format', () => {
      const shuboxFile = { s3url: 'http://s3.com/image.gif' } as ShuboxFile;
      const smallerMp4 = new Variant(shuboxFile, '10x10.mp4').url();

      expect(smallerMp4).to.equal('http://s3.com/10x10_image.gif.mp4');
    });
  });
});

