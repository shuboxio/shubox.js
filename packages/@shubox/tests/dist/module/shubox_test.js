import * as Chai from "chai";
import Shubox from "shubox";
import { setupJsDom, teardownJsDom } from "./test_helper";
var expect = Chai.expect;
describe("Shubox", function () {
    describe(".instances", function () {
        beforeEach(function (done) {
            setupJsDom(function () {
                done();
            });
        });
        afterEach(function () {
            teardownJsDom();
        });
        it("holds onto all instances of shubox on a page", function () {
            var noOp = new Shubox(".upload");
            expect(Shubox.instances.length).to.equal(2);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL3NodWJveF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsVUFBVSxFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV4RCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBRTNCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixVQUFVLENBQUMsVUFBQyxJQUFJO1lBQ2QsVUFBVSxDQUFDO2dCQUNULElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQztZQUNSLGFBQWEsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=