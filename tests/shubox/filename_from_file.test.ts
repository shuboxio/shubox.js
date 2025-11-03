/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest'
import { filenameFromFile } from "../../src/shubox/utils/filenameFromFile";

export interface IFile {
  name: string | null | undefined;
}

describe("filenameFromFile", () => {
  test("returns file name and extension", () => {
    const file = { name: "whatever.jpg" };
    const result = filenameFromFile(file);

    expect(result).to.equal("whatever.jpg");
  });

  test("sanitizes file name", () => {
    const spaces = { name: "photo with spaces.jpg" };
    const randomChars = { name: 'file-.webm_; echo "hello";.jpg' };
    const slashes = { name: `.//file\\name.jpg` };

    expect(filenameFromFile(spaces)).to.equal("photo_with_spaces.jpg");
    expect(filenameFromFile(randomChars)).to.equal("file-.webm___echo__hello__.jpg");
    expect(filenameFromFile(slashes)).to.equal("file_name.jpg");
  });

  test("assigns a filename if it was pasted", () => {
    const pasted = { name: null };

    expect(filenameFromFile(pasted)).to.match(/^paste[0-9\.-]*.jpg$/);
  });
});
