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
import { Webcam } from "./src/webcam";
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
                this.webcam = new Webcam(dropzone, this.element, this.options.webcam);
            }
            this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
            Shubox.instances.push(dropzone);
        }
    };
    Shubox.instances = [];
    Shubox.stopCamera = Webcam.stopCamera;
    return Shubox;
}());
export default Shubox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBc0JwQztJQWFFLGdCQUFZLFFBQTRCLEVBQUUsT0FBMEI7UUFBeEQseUJBQUEsRUFBQSxvQkFBNEI7UUFBRSx3QkFBQSxFQUFBLFlBQTBCO1FBVDdELGlCQUFZLEdBQVcsa0NBQWtDLENBQUM7UUFDMUQsY0FBUyxHQUFXLCtCQUErQixDQUFDO1FBQ3BELFFBQUcsR0FBVyxFQUFFLENBQUM7UUFHakIsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixjQUFTLEdBQVEsRUFBRSxDQUFDO1FBSXpCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDekMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNuQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDMUI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQztTQUNyQjtRQUVELElBQUksT0FB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