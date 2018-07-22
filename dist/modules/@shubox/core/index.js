import { ShuboxCallbacks } from './src/shubox_callbacks';
import { ShuboxFormCallbacks } from './src/shubox_form_callbacks';
import { ShuboxOptions } from './src/shubox_options';
import { ShuboxFormOptions } from './src/shubox_form_options';
import { mergeObject } from './src/merge_object';
import Dropzone from 'dropzone';
var Shubox = /** @class */ (function () {
    function Shubox(selector, options) {
        if (selector === void 0) { selector = '.shubox'; }
        if (options === void 0) { options = {}; }
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.options = {};
        this.callbacks = {};
        this.selector = selector;
        this.init(options);
    }
    Shubox.prototype.init = function (options) {
        Dropzone.autoDiscover = false;
        var els = document.querySelectorAll(this.selector);
        for (var i = 0; i < els.length; i++) {
            this.element = els[i];
            var shuboxCallbacks = new ShuboxCallbacks(this).toHash();
            if ('INPUT' === this.element.tagName || 'TEXTAREA' === this.element.tagName) {
                var shuboxFormCallbacks = new ShuboxFormCallbacks(this).toHash();
                this.options = mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
                this.callbacks = mergeObject(this.callbacks, shuboxCallbacks, shuboxFormCallbacks);
            }
            else {
                this.options = mergeObject(this.options, ShuboxOptions, options);
                this.callbacks = mergeObject(this.callbacks, shuboxCallbacks);
            }
            Shubox.instances[i] = new Dropzone(this.element, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBRWhDO0lBU0UsZ0JBQVksUUFBNEIsRUFBRSxPQUFvQjtRQUFsRCx5QkFBQSxFQUFBLG9CQUE0QjtRQUFFLHdCQUFBLEVBQUEsWUFBb0I7UUFQOUQsaUJBQVksR0FBVyxrQ0FBa0MsQ0FBQztRQUMxRCxjQUFTLEdBQVcsK0JBQStCLENBQUM7UUFHcEQsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixjQUFTLEdBQVEsRUFBRSxDQUFDO1FBR2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxPQUFlO1FBQ2xCLFFBQVEsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFnQixDQUFDO1lBQ3JDLElBQUksZUFBZSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRXpELElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDM0UsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNqRSxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzthQUNwRjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakUsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQTthQUM5RDtZQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDL0MsR0FBRyxFQUFFLDBDQUEwQztnQkFDL0MsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7Z0JBQ2pELFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07Z0JBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Z0JBQy9CLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Z0JBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUs7Z0JBQzNCLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWM7Z0JBQzdDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CO2dCQUN2RCxXQUFXLEVBQUUsTUFBTTtnQkFDbkIsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFDL0Isb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7Z0JBQ3ZELGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7YUFDMUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBaERNLGdCQUFTLEdBQW9CLEVBQUUsQ0FBQztJQWlEekMsYUFBQztDQUFBLEFBbERELElBa0RDO2VBbERvQixNQUFNIn0=