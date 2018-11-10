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
            this.options = __assign({}, this.options, (new ShuboxOptions(this).toHash()), options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUVoQztJQVVFLGdCQUFZLFFBQTRCLEVBQUUsT0FBb0I7UUFBbEQseUJBQUEsRUFBQSxvQkFBNEI7UUFBRSx3QkFBQSxFQUFBLFlBQW9CO1FBUjlELGlCQUFZLEdBQVcsa0NBQWtDLENBQUM7UUFDMUQsY0FBUyxHQUFXLCtCQUErQixDQUFDO1FBQ3BELFNBQUksR0FBVyxFQUFFLENBQUM7UUFHbEIsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixjQUFTLEdBQVEsRUFBRSxDQUFDO1FBR2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsT0FBTyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDN0I7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxPQUFlO1FBQ2xCLFFBQVEsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFnQixDQUFDO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEQsSUFBSSxDQUFDLE9BQU8sZ0JBQ1AsSUFBSSxDQUFDLE9BQU8sRUFDWixDQUFDLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQ2xDLE9BQU8sQ0FDWCxDQUFBO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMvQyxHQUFHLEVBQUUsa0JBQWtCO2dCQUN2QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtnQkFDakQsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztnQkFDakMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtnQkFDL0Isb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0I7Z0JBQ3ZELGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7Z0JBQ3pDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07Z0JBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Z0JBQy9CLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Z0JBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUs7Z0JBQzNCLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWM7Z0JBQzdDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CO2FBQ3hELENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQTFETSxnQkFBUyxHQUFvQixFQUFFLENBQUM7SUEyRHpDLGFBQUM7Q0FBQSxBQTVERCxJQTREQztlQTVEb0IsTUFBTSJ9