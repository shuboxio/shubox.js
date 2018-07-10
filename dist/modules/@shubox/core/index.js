import { ShuboxCallbacks } from './src/shubox_callbacks';
import { ShuboxFormCallbacks } from './src/shubox_form_callbacks';
import { ShuboxOptions } from './src/shubox_options';
import { ShuboxFormOptions } from './src/shubox_form_options';
import { mergeObject } from './src/merge_object';
import * as Dropzone from 'dropzone';
var Shubox = /** @class */ (function () {
    function Shubox(selector, options) {
        if (selector === void 0) { selector = '.shubox'; }
        if (options === void 0) { options = {}; }
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.options = {};
        this.selector = selector;
        this.options = options;
        this.init(options);
    }
    Shubox.prototype.init = function (options) {
        var els = document.querySelectorAll(this.selector);
        for (var i = 0; i < els.length; i++) {
            this.element = els[i];
            var callbacks = new ShuboxCallbacks(this);
            if ('INPUT' === this.element.tagName || 'TEXTAREA' === this.element.tagName) {
                var formCallbacks = new ShuboxFormCallbacks(this);
                mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
                mergeObject(callbacks, formCallbacks);
            }
            else {
                mergeObject(this.options, ShuboxOptions, options);
            }
            Shubox.instances[i] = new Dropzone(this.element, {
                url: 'https://localhost-4100.s3.amazonaws.com/',
                method: 'PUT',
                previewsContainer: this.options.previewsContainer,
                clickable: this.options.clickable,
                accept: callbacks.accept,
                sending: callbacks.sending,
                success: callbacks.success,
                error: callbacks.error,
                uploadprogress: callbacks.uploadProgress,
                totaluploadprogress: callbacks.totalUploadProgress,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFFckM7SUFRRSxnQkFBWSxRQUE0QixFQUFFLE9BQW9CO1FBQWxELHlCQUFBLEVBQUEsb0JBQTRCO1FBQUUsd0JBQUEsRUFBQSxZQUFvQjtRQU45RCxpQkFBWSxHQUFXLGtDQUFrQyxDQUFDO1FBQzFELGNBQVMsR0FBVywrQkFBK0IsQ0FBQztRQUdwRCxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBR2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxPQUFlO1FBQ2xCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFnQixDQUFDO1lBQ3JDLElBQUksU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFDLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDM0UsSUFBSSxhQUFhLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEQsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNyRSxXQUFXLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNuRDtZQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDL0MsR0FBRyxFQUFFLDBDQUEwQztnQkFDL0MsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7Z0JBQ2pELFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7Z0JBQ2pDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDeEIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPO2dCQUMxQixPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU87Z0JBQzFCLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSztnQkFDdEIsY0FBYyxFQUFFLFNBQVMsQ0FBQyxjQUFjO2dCQUN4QyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsbUJBQW1CO2dCQUNsRCxXQUFXLEVBQUUsTUFBTTtnQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFDL0Isb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7Z0JBQ3ZELGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7YUFDMUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBN0NNLGdCQUFTLEdBQW9CLEVBQUUsQ0FBQztJQThDekMsYUFBQztDQUFBLEFBL0NELElBK0NDO2VBL0NvQixNQUFNIn0=