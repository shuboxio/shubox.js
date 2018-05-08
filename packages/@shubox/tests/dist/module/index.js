import * as Chai from 'chai';
import { setupJsDom, teardownJsDom } from './test_helper';
import { Shubox } from 'shubox';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxVQUFVLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFOUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUUzQixRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsVUFBVSxDQUFDLFVBQUEsSUFBSTtZQUNiLFVBQVUsQ0FBQztnQkFDVCxJQUFJLEVBQUUsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUM7WUFDUixhQUFhLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV0QixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9