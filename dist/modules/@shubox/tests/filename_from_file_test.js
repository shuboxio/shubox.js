import * as Chai from "chai";
import { filenameFromFile } from "../core/src/filename_from_file";
var expect = Chai.expect;
describe("filenameFromFile", function () {
    it("returns file name and extension", function () {
        var file = { name: "whatever.jpg" };
        var result = filenameFromFile(file);
        expect(result).to.equal("whatever.jpg");
    });
    it("sanitizes file name", function () {
        var spaces = { name: "photo with spaces.jpg" };
        var randomChars = { name: 'file-.webm_; echo "hello";.jpg' };
        var slashes = { name: ".//file\\name.jpg" };
        expect(filenameFromFile(spaces)).to.equal("photo_with_spaces.jpg");
        expect(filenameFromFile(randomChars)).to.equal("file-.webm___echo__hello__.jpg");
        expect(filenameFromFile(slashes)).to.equal("file_name.jpg");
    });
    it("assigns a filename if it was pasted", function () {
        var pasted = { name: null };
        expect(filenameFromFile(pasted)).to.match(/^paste[0-9\.-]*.jpg$/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZW5hbWVfZnJvbV9maWxlX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL2ZpbGVuYW1lX2Zyb21fZmlsZV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRWhFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFNM0IsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBQzNCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtRQUNwQyxJQUFNLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQztRQUN0QyxJQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QixJQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDO1FBQ2pELElBQU0sV0FBVyxHQUFJLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFDLENBQUM7UUFDL0QsSUFBTSxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztRQUU3QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbkUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsSUFBTSxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFOUIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==