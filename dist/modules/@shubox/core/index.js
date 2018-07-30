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
        this.uuid = '';
        this.options = {};
        this.callbacks = {};
        this.selector = selector;
        if (options['signatureUrl']) {
            this.signatureUrl = options['signatureUrl'];
            delete (options['signatureUrl']);
        }
        if (options['uploadUrl']) {
            this.uploadUrl = options['uploadUrl'];
            delete (options['uploadUrl']);
        }
        if (options['uuid']) {
            this.uuid = options['uuid'];
            delete (options['uuid']);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBRWhDO0lBVUUsZ0JBQVksUUFBNEIsRUFBRSxPQUFvQjtRQUFsRCx5QkFBQSxFQUFBLG9CQUE0QjtRQUFFLHdCQUFBLEVBQUEsWUFBb0I7UUFSOUQsaUJBQVksR0FBVyxrQ0FBa0MsQ0FBQztRQUMxRCxjQUFTLEdBQVcsK0JBQStCLENBQUM7UUFDcEQsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUdsQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGNBQVMsR0FBUSxFQUFFLENBQUM7UUFHbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBRyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDNUMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsSUFBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NB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