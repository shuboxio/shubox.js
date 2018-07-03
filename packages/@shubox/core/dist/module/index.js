import { ShuboxCallbacks } from './src/shubox_callbacks';
import * as Dropzone from 'dropzone';
var Shubox = /** @class */ (function () {
    function Shubox(selector) {
        if (selector === void 0) { selector = '.shubox'; }
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.callbacks = new ShuboxCallbacks();
        this.selector = selector;
        this.init(selector);
    }
    Shubox.prototype.init = function (selector) {
        var els = document.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            Shubox.instances[i] = new Dropzone(el, {
                url: 'https://localhost-4100.s3.amazonaws.com/',
                method: 'PUT',
                previewsContainer: this.options.previewsContainer,
                clickable: this.options.clickable,
                accept: this.callbacks.accept,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                error: this.callbacks.error,
                uploadprogress: this.callbacks.uploadProgress,
                totaluploadprogress: this.callbacks.totalUploadProgress,
                maxFilesize: 100000,
                maxFiles: this.options.maxFiles,
                dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
                acceptedFiles: this.options.acceptedFiles,
            });
        }
    };
    Shubox.instances = [];
    return Shubox;
}());
export default Shubox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXZELE9BQU8sS0FBSyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBRXJDO0lBbUNFLGdCQUFZLFFBQTRCO1FBQTVCLHlCQUFBLEVBQUEsb0JBQTRCO1FBaEN4QyxpQkFBWSxHQUFXLGtDQUFrQyxDQUFDO1FBQzFELGNBQVMsR0FBVywrQkFBK0IsQ0FBQztRQUVwRCxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGdCQUFXLEdBQVcsRUFBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUNqRCxjQUFTLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7UUE0QmpELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQTdCRCxxQkFBSSxHQUFKLFVBQUssUUFBZ0I7UUFDbkIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQWdCLENBQUM7WUFFL0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3JDLEdBQUcsRUFBRSwwQ0FBMEM7Z0JBQy9DLE1BQU0sRUFBRSxLQUFLO2dCQUNiLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCO2dCQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUNqQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO2dCQUM3QixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPO2dCQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPO2dCQUMvQixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLO2dCQUMzQixjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjO2dCQUM3QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQjtnQkFDdkQsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7Z0JBQy9CLG9CQUFvQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CO2dCQUN2RCxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhO2FBQzFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQWhDTSxnQkFBUyxHQUFvQixFQUFFLENBQUM7SUF1Q3pDLGFBQUM7Q0FBQSxBQXhDRCxJQXdDQztlQXhDb0IsTUFBTSJ9