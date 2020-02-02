var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Dropzone from "dropzone";
import { ShuboxCallbacks } from "./src/shubox_callbacks";
import { ShuboxOptions } from "./src/shubox_options";
import { ShuboxWebcam } from "./src/shubox_webcam";
var Shubox = /** @class */ (function () {
    function Shubox(selector, options) {
        if (selector === void 0) { selector = ".shubox"; }
        if (options === void 0) { options = {}; }
        this.signatureUrl = "https://api.shubox.io/signatures";
        this.uploadUrl = "https://api.shubox.io/uploads";
        this.key = "";
        this.options = {};
        this.callbacks = {};
        this.selector = selector;
        if (options.signatureUrl) {
            this.signatureUrl = options.signatureUrl;
            delete options.signatureUrl;
        }
        if (options.uploadUrl) {
            this.uploadUrl = options.uploadUrl;
            delete options.uploadUrl;
        }
        if (options.uuid) {
            this.key = options.uuid;
            delete options.uuid;
        }
        if (options.key) {
            this.key = options.key;
            delete options.key;
        }
        this.init(options);
    }
    Shubox.prototype.init = function (options) {
        Dropzone.autoDiscover = false;
        var els = document.querySelectorAll(this.selector);
        for (var _i = 0, _a = Array.from(els); _i < _a.length; _i++) {
            var element = _a[_i];
            this.element = element;
            this.callbacks = new ShuboxCallbacks(this).toHash();
            this.options = __assign(__assign(__assign({}, this.options), (new ShuboxOptions(this).toHash())), options);
            if (this.options.webcam) {
                this.options.clickable = false;
            }
            var dropzoneOptions = {
                // callbacks that we need to delegate to. In some cases there's work
                // needing to be passed through to Shubox's handler, and sometimes
                // the Dropbox handler, _in addition to_ the callback the user provides.
                accept: this.callbacks.accept,
                acceptedFiles: this.options.acceptedFiles,
                addedfile: this.callbacks.addedfile,
                error: this.callbacks.error,
                previewsContainer: this.options.previewsContainer,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                uploadprogress: this.callbacks.uploadProgress,
                url: "http://localhost",
            };
            var dropzone = new Dropzone(this.element, __assign(__assign({}, this.options), dropzoneOptions));
            if (this.options.webcam) {
                var webcam = new ShuboxWebcam(dropzone, this.element, this.options.webcam);
                webcam.init();
            }
            this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
            Shubox.instances.push(dropzone);
        }
    };
    Shubox.instances = [];
    Shubox.stopVideo = ShuboxWebcam.stopVideo;
    return Shubox;
}());
export default Shubox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFpQmpEO0lBWUUsZ0JBQVksUUFBNEIsRUFBRSxPQUEwQjtRQUF4RCx5QkFBQSxFQUFBLG9CQUE0QjtRQUFFLHdCQUFBLEVBQUEsWUFBMEI7UUFSN0QsaUJBQVksR0FBVyxrQ0FBa0MsQ0FBQztRQUMxRCxjQUFTLEdBQVcsK0JBQStCLENBQUM7UUFDcEQsUUFBRyxHQUFXLEVBQUUsQ0FBQztRQUdqQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLGNBQVMsR0FBUSxFQUFFLENBQUM7UUFHekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztZQUN6QyxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUM7U0FDN0I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ25DLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQztTQUMxQjtRQUVELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNoQixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDeEIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxP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