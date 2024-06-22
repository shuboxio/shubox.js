/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { Variant } from "../../src/shubox/variant";

export interface IShuboxFile {
  s3url: string;
}

describe("Variant", () => {
  describe("#url", () => {
    test("returns a url with unmodified variant", () => {
      const shuboxFile = { s3url: "http://s3.com/image.jpg" } as IShuboxFile;
      const hashVariant = new Variant(shuboxFile, "200x200%23", 1.0, false).url();
      const caratVariant = new Variant(shuboxFile, "200x200^", 1.0, false).url();
      const bangVariant = new Variant(shuboxFile, "200x200!", 1.0, false).url();

      expect(hashVariant).to.equal("http://s3.com/200x200%23_image.jpg");
      expect(caratVariant).to.equal("http://s3.com/200x200^_image.jpg");
      expect(bangVariant).to.equal("http://s3.com/200x200!_image.jpg");
    });

    test("returns a url with the correct variant", () => {
      const shuboxFile = { s3url: "http://s3.com/image.jpg" } as IShuboxFile;
      const hashVariant = new Variant(shuboxFile, "200x200#").url();
      const caratVariant = new Variant(shuboxFile, "200x200^").url();
      const bangVariant = new Variant(shuboxFile, "200x200!").url();

      expect(hashVariant).to.equal("http://s3.com/200x200_hash_image.jpg");
      expect(caratVariant).to.equal("http://s3.com/200x200_carat_image.jpg");
      expect(bangVariant).to.equal("http://s3.com/200x200_bang_image.jpg");
    });

    describe("when using shubox API version >= 2.0", () => {
      test("returns another format of the file", () => {
        const shuboxFile = { s3url: "http://s3.com/image.gif" } as IShuboxFile;
        const mp4 = new Variant(shuboxFile, ".mp4", 2.0).url();

        expect(mp4).to.equal("http://s3.com/image.mp4");
      });

      test("returns both the prefix and file format", () => {
        const shuboxFile = { s3url: "http://s3.com/animated.gif" } as IShuboxFile;
        const smallerMp4 = new Variant(shuboxFile, "10x10.mp4", 2.0).url();

        expect(smallerMp4).to.equal("http://s3.com/10x10_animated.mp4");
      });
    });

    describe("when using shubox API version < 2.0 (the default)", () => {
      test("returns another format of the file", () => {
        const shuboxFile = { s3url: "http://s3.com/image.gif" } as IShuboxFile;
        const mp4 = new Variant(shuboxFile, ".mp4").url();

        expect(mp4).to.equal("http://s3.com/image.gif.mp4");
      });

      test("returns both the prefix and file format", () => {
        const shuboxFile = { s3url: "http://s3.com/animated.gif" } as IShuboxFile;
        const smallerMp4 = new Variant(shuboxFile, "10x10.mp4").url();

        expect(smallerMp4).to.equal("http://s3.com/10x10_animated.gif.mp4");
      });
    });
  });
});
