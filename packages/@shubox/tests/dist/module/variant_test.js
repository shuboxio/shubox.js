import * as Chai from "chai";
import { Variant } from "../core/src/variant";
var expect = Chai.expect;
describe("Variant", function () {
    describe("#url", function () {
        it("returns a url with the correct variant", function () {
            var shuboxFile = { s3url: "http://s3.com/image.jpg" };
            var hashVariant = new Variant(shuboxFile, "200x200#").url();
            var caratVariant = new Variant(shuboxFile, "200x200^").url();
            var bangVariant = new Variant(shuboxFile, "200x200!").url();
            expect(hashVariant).to.equal("http://s3.com/200x200_hash_image.jpg");
            expect(caratVariant).to.equal("http://s3.com/200x200_carat_image.jpg");
            expect(bangVariant).to.equal("http://s3.com/200x200_bang_image.jpg");
        });
        it("returns another format of the file", function () {
            var shuboxFile = { s3url: "http://s3.com/image.gif" };
            var mp4 = new Variant(shuboxFile, ".mp4").url();
            expect(mp4).to.equal("http://s3.com/image.gif.mp4");
        });
        it("returns both the prefix and file format", function () {
            var shuboxFile = { s3url: "http://s3.com/image.gif" };
            var smallerMp4 = new Variant(shuboxFile, "10x10.mp4").url();
            expect(smallerMp4).to.equal("http://s3.com/10x10_image.gif.mp4");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC90ZXN0cy92YXJpYW50X3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTVDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFNM0IsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLElBQU0sVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFpQixDQUFDO1lBQ3ZFLElBQU0sV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM5RCxJQUFNLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDL0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTlELE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDckUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO1lBQ3ZDLElBQU0sVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFpQixDQUFDO1lBQ3ZFLElBQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUVsRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLElBQU0sVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFpQixDQUFDO1lBQ3ZFLElBQU0sVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUU5RCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9