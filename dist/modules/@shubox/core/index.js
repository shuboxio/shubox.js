import { ShuboxCallbacks } from './src/shubox_callbacks';
var Shubox = /** @class */ (function () {
    function Shubox(selector) {
        if (selector === void 0) { selector = '.shubox'; }
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.callbacks = new ShuboxCallbacks();
        this.selector = selector;
    }
    Shubox.instances = [];
    return Shubox;
}());
export { Shubox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBR3ZEO0lBVUUsZ0JBQVksUUFBNEI7UUFBNUIseUJBQUEsRUFBQSxvQkFBNEI7UUFQeEMsaUJBQVksR0FBVyxrQ0FBa0MsQ0FBQztRQUMxRCxjQUFTLEdBQVcsK0JBQStCLENBQUM7UUFFcEQsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixnQkFBVyxHQUFXLEVBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDakQsY0FBUyxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1FBR2pELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFYTSxnQkFBUyxHQUFrQixFQUFFLENBQUM7SUFZdkMsYUFBQztDQUFBLEFBYkQsSUFhQztTQWJZLE1BQU0ifQ==