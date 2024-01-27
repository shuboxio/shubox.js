import * as Chai from "chai";
import { filenameFromFile } from "../../core/src/filename_from_file";

const expect = Chai.expect;

export interface IFile {
  name: string | null | undefined;
}

describe("filenameFromFile", () => {
  it("returns file name and extension", () => {
    const file = { name: "whatever.jpg" };
    const result = filenameFromFile(file);

    expect(result).to.equal("whatever.jpg");
  });

  it("sanitizes file name", () => {
    const spaces = { name: "photo with spaces.jpg" };
    const randomChars = { name: 'file-.webm_; echo "hello";.jpg' };
    const slashes = { name: `.//file\\name.jpg` };

    expect(filenameFromFile(spaces)).to.equal("photo_with_spaces.jpg");
    expect(filenameFromFile(randomChars)).to.equal("file-.webm___echo__hello__.jpg");
    expect(filenameFromFile(slashes)).to.equal("file_name.jpg");
  });

  it("assigns a filename if it was pasted", () => {
    const pasted = { name: null };

    expect(filenameFromFile(pasted)).to.match(/^paste[0-9\.-]*.jpg$/);
  });
});
