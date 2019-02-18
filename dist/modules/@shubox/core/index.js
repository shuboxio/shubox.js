var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { ShuboxCallbacks } from './src/shubox_callbacks';
import { ShuboxOptions } from './src/shubox_options';
import Dropzone from 'dropzone';
var Shubox = /** @class */ (function () {
    function Shubox(selector, options) {
        if (selector === void 0) { selector = '.shubox'; }
        if (options === void 0) { options = {}; }
        this.signatureUrl = 'https://api.shubox.io/signatures';
        this.uploadUrl = 'https://api.shubox.io/uploads';
        this.key = '';
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
            this.key = options['uuid'];
            delete options['uuid'];
        }
        if (options['key']) {
            this.key = options['key'];
            delete options['key'];
        }
        this.init(options);
    }
    Shubox.prototype.init = function (options) {
        Dropzone.autoDiscover = false;
        var els = document.querySelectorAll(this.selector);
        for (var i = 0; i < els.length; i++) {
            this.element = els[i];
            this.callbacks = new ShuboxCallbacks(this).toHash();
            this.options = __assign({}, this.options, (new ShuboxOptions(this).toHash()), options);
            var dzOptions = {
                url: 'http://localhost',
                previewsContainer: this.options.previewsContainer,
                clickable: this.options.clickable,
                maxFiles: this.options.maxFiles,
                maxFilesize: this.options.maxFilesize,
                dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
                acceptedFiles: this.options.acceptedFiles,
                accept: this.callbacks.accept,
                addedfile: this.callbacks.addedfile,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                error: this.callbacks.error,
                uploadprogress: this.callbacks.uploadProgress,
                totaluploadprogress: this.callbacks.totalUploadProgress,
                queuecomplete: this.callbacks.queuecomplete,
            };
            var dropzone = new Dropzone(this.element, __assign({}, options, dzOptions));
            this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
            Shubox.instances.push(dropzone);
        }
    };
    Shubox.instances = [];
    return Shubox;
}());
export default Shubox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUVoQztJQVVFLGdCQUFZLFFBQTRCLEVBQUUsT0FBb0I7UUFBbEQseUJBQUEsRUFBQSxvQkFBNEI7UUFBRSx3QkFBQSxFQUFBLFlBQW9CO1FBUjlELGlCQUFZLEdBQVcsa0NBQWtDLENBQUM7UUFDMUQsY0FBUyxHQUFXLCtCQUErQixDQUFDO1FBQ3BELFFBQUcsR0FBVyxFQUFFLENBQUM7UUFHakIsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixjQUFTLEdBQVEsRUFBRSxDQUFDO1FBR2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtRQUVELElBQUksT0FB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