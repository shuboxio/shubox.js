import * as Chai from 'chai';
import { setupJsDom, teardownJsDom } from './test_helper';
import Shubox from 'shubox';
var expect = Chai.expect;
describe('Shubox', function () {
    describe('.instances', function () {
        beforeEach(function (done) {
            setupJsDom(function () {
                done();
            });
        });
        afterEach(function () {
            teardownJsDom();
        });
        it('holds onto all instances of shubox on a page', function () {
            new Shubox('.upload');
            expect(Shubox.instances.length).to.equal(2);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxVQUFVLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUU1QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBRTNCLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixVQUFVLENBQUMsVUFBQSxJQUFJO1lBQ2IsVUFBVSxDQUFDO2dCQUNULElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQztZQUNSLGFBQWEsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=