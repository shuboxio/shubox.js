import { ShuboxCallbacks } from './src/shubox_callbacks';
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
        this.uuid = '';
        this.options = {};
        this.callbacks = {};
        this.selector = selector;
        if (options['signatureUrl']) {
            this.signatureUrl = options['signatureUrl'];
            delete options['signatureUrl'];
        }
        if (options['uploadUrl']) {
            this.uploadUrl = options['uploadUrl'];
            delete options['uploadUrl'];
        }
        if (options['uuid']) {
            this.uuid = options['uuid'];
            delete options['uuid'];
        }
        this.init(options);
    }
    Shubox.prototype.init = function (options) {
        Dropzone.autoDiscover = false;
        var els = document.querySelectorAll(this.selector);
        for (var i = 0; i < els.length; i++) {
            this.element = els[i];
            this.callbacks = new ShuboxCallbacks(this).toHash();
            if ('INPUT' === this.element.tagName ||
                'TEXTAREA' === this.element.tagName) {
                this.options = mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
            }
            else {
                this.options = mergeObject(this.options, ShuboxOptions, options);
            }
            Shubox.instances[i] = new Dropzone(this.element, {
                url: 'http://localhost',
                previewsContainer: this.options.previewsContainer,
                clickable: this.options.clickable,
                maxFiles: this.options.maxFiles,
                dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
                acceptedFiles: this.options.acceptedFiles,
                accept: this.callbacks.accept,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                error: this.callbacks.error,
                uploadprogress: this.callbacks.uploadProgress,
                totaluploadprogress: this.callbacks.totalUploadProgress,
            });
        }
    };
    Shubox.instances = [];
    return Shubox;
}());
export default Shubox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBRWhDO0lBVUUsZ0JBQVksUUFBNEIsRUFBRSxPQUFvQjtRQUFsRCx5QkFBQSxFQUFBLG9CQUE0QjtRQUFFLHdCQUFBLEVBQUEsWUFBb0I7UUFSOUQsaUJBQVksR0FBVyxrQ0FBa0MsQ0FBQztRQUMxRCxjQUFTLEdBQVcsK0JBQStCLENBQUM7UUFDcEQsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUdsQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGNBQVMsR0FBUSxFQUFFLENBQUM7UUFHbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDNUMsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN0QyxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM3QjtRQUVELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQscUJBQUksR0FBSixVQUFLLE9BQWU7UUFDbEIsUUFBUSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQWdCLENBQUM7WUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVwRCxJQUNFLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Z0JBQ2hDLFVBQVUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFDbkM7Z0JBQ0EsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDckY7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbEU7WUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQy9DLEdBQUcsRUFBRSxrQkFBa0I7Z0JBQ3ZCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCO2dCQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO2dCQUNqQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUMvQixvQkFBb0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQjtnQkFDdkQsYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYTtnQkFDekMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtnQkFDN0IsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTztnQkFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTztnQkFDL0IsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSztnQkFDM0IsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYztnQkFDN0MsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUI7YUFDeEQsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBOURNLGdCQUFTLEdBQW9CLEVBQUUsQ0FBQztJQStEekMsYUFBQztDQUFBLEFBaEVELElBZ0VDO2VBaEVvQixNQUFNIn0=