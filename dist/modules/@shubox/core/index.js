import { ShuboxCallbacks } from './src/shubox_callbacks';
var Shubox = /** @class */ (function () {
    function Shubox() {
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.callbacks = new ShuboxCallbacks();
    }
    Shubox.instances = [];
    return Shubox;
}());
export { Shubox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBR3ZEO0lBVUU7UUFQQSxpQkFBWSxHQUFXLGtDQUFrQyxDQUFDO1FBQzFELGNBQVMsR0FBVywrQkFBK0IsQ0FBQztRQUVwRCxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGdCQUFXLEdBQVcsRUFBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUNqRCxjQUFTLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7SUFFcEMsQ0FBQztJQVRULGdCQUFTLEdBQWtCLEVBQUUsQ0FBQztJQVV2QyxhQUFDO0NBQUEsQUFYRCxJQVdDO1NBWFksTUFBTSJ9