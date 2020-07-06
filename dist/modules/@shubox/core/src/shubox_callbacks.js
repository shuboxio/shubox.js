import Dropzone from "dropzone";
import { filenameFromFile } from "./filename_from_file";
import { insertAtCursor } from "./insert_at_cursor";
import { objectToFormData } from "./object_to_form_data";
import { TransformCallback } from "./transform_callback";
import { uploadCompleteEvent } from "./upload_complete_event";
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox, instances) {
        this.replaceable = [
            "height",
            "width",
            "name",
            "s3",
            "s3url",
            "size",
            "type",
        ];
        this.shubox = shubox;
        this.instances = instances;
    }
    ShuboxCallbacks.pasteCallback = function (dz) {
        return (function (event) {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.kind === "file") {
                    // adds the file to your dropzone instance
                    dz.addFile(item.getAsFile());
                }
            }
        });
    };
    ShuboxCallbacks.prototype.toHash = function () {
        // assigning `this` (instance of ShuboxCallbacks) to `self` to that `this`
        // inside the body of these callback functions are reserved for the
        // instance of Dropzone that fires the function.
        var self = this;
        var hash = {
            accept: function (file, done) {
                fetch(self.shubox.signatureUrl, {
                    body: objectToFormData({
                        file: {
                            name: filenameFromFile(file),
                            size: file.size,
                            type: file.type,
                        },
                        key: self.shubox.key,
                        s3Key: self.shubox.options.s3Key,
                    }),
                    method: "post",
                    mode: "cors",
                })
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (json) {
                    if (json.error) {
                        self.shubox.callbacks.error(file, json.error);
                    }
                    else {
                        self.instances.forEach(function (dz) {
                            dz.options.url = json.aws_endpoint;
                        });
                        file.postData = json;
                        file.s3 = json.key;
                        done();
                    }
                })
                    .catch(function (err) {
                    self.shubox.callbacks.error(file, err.message);
                });
            },
            sending: function (file, xhr, formData) {
                self.shubox.element.classList.add("shubox-uploading");
                // Update the form value if it is able
                if (self._isFormElement()) {
                    self._updateFormValue(file, "uploadingTemplate");
                }
                var keys = Object.keys(file.postData);
                keys.forEach(function (key) {
                    var val = file.postData[key];
                    formData.append(key, val);
                });
                // Run user's provided sending callback
                self.shubox.options.sending(file, xhr, formData);
            },
            addedfile: function (file) {
                Dropzone.prototype.defaultOptions.addedfile.apply(this, [file]);
                self.shubox.options.addedfile(file);
            },
            success: function (file, response) {
                self.shubox.element.classList.add("shubox-success");
                self.shubox.element.classList.remove("shubox-uploading");
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ["", ""];
                var url = match[1];
                file.s3url = url.replace(/%2F/g, "/").replace(/%2B/g, "%20");
                if (self.shubox.options.cdn) {
                    var path = file.s3url.split("/").slice(4).join("/");
                    file.s3url = self.shubox.options.cdn + "/" + path;
                }
                uploadCompleteEvent(self.shubox, file, (self.shubox.options.extraParams || {}));
                Dropzone.prototype.defaultOptions.success.apply(this, [file, response]);
                // Update the form value if it is able
                if (self._isFormElement()) {
                    self._updateFormValue(file, "successTemplate");
                }
                if (self.shubox.options.transformCallbacks) {
                    var callbacks = self.shubox.options.transformCallbacks;
                    for (var _i = 0, _a = Object.keys(callbacks); _i < _a.length; _i++) {
                        var variant = _a[_i];
                        var callback = callbacks[variant];
                        new TransformCallback(file, variant, callback).run();
                    }
                }
                // If supplied, run the options callback
                if (self.shubox.options.success) {
                    self.shubox.options.success(file);
                }
            },
            error: function (file, message) {
                self.shubox.element.classList.remove("shubox-uploading");
                self.shubox.element.classList.add("shubox-error");
                var xhr = new XMLHttpRequest(); // bc type signature
                Dropzone.prototype.defaultOptions.error.apply(this, [file, message, xhr]);
                if (message.includes("Referring domain not permitted") && window.location.hostname === "localhost") {
                    console.log("%cOOPS!", "font-size: 14px; color:#7c5cd1; font-weight: bold;");
                    console.log("%cIt looks like you're attempting to test Shubox on localhost but are running into an issue.\nYou should check to make sure you're using your %c\"Sandbox\" %ckey while you test as it will\nwork with localhost.\n\n%cFor more information and instructions: https://dashboard.shubox.io/domains/sandbox", "font-size: 12px; color:#7c5cd1;", "font-size: 12px; color:#7c5cd1; font-weight:bold", "font-size: 12px; color:#7c5cd1;", "font-size: 13px; color:#7c5cd1; font-weight:bold;");
                }
                if (self.shubox.options.error) {
                    self.shubox.options.error(file, message);
                }
            },
            uploadProgress: function (file, progress, bytesSent) {
                self.shubox.element.dataset.shuboxProgress = String(progress);
                Dropzone.prototype.defaultOptions.uploadprogress.apply(this, [file, progress, bytesSent]);
            },
        };
        return hash;
    };
    // Private
    ShuboxCallbacks.prototype._updateFormValue = function (file, templateName) {
        var el = this.shubox.element;
        var interpolatedText = "";
        // If we're processing the successTemplate, and the user instead used
        // the deprecated "s3urlTemplate" option, then rename the template name
        // to use that one as the key.
        if (templateName === "successTemplate" && this.shubox.options.s3urlTemplate) {
            window.console.warn("DEPRECATION: The \"s3urlTemplate\" will be deprecated by version 1.0. Please update to \"successTemplate\".");
            templateName = "s3urlTemplate";
        }
        if (this.shubox.options[templateName]) {
            interpolatedText = this.shubox.options[templateName];
        }
        for (var _i = 0, _a = this.replaceable; _i < _a.length; _i++) {
            var key = _a[_i];
            interpolatedText = interpolatedText.replace("{{" + key + "}}", file[key]);
        }
        if (this._insertableAtCursor(el)) {
            insertAtCursor(el, interpolatedText);
        }
        else if (this._isAppendingText()) {
            el.value = el.value + interpolatedText;
        }
        else {
            el.value = interpolatedText;
        }
    };
    ShuboxCallbacks.prototype._isFormElement = function () {
        return (["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) > -1);
    };
    ShuboxCallbacks.prototype._isAppendingText = function () {
        return (this.shubox.options.textBehavior === "append");
    };
    ShuboxCallbacks.prototype._insertableAtCursor = function (el) {
        return (el.tagName === "TEXTAREA" &&
            this.shubox.options.textBehavior === "insertAtCursor");
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFFaEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBc0I1RDtJQTZCRSx5QkFBWSxNQUFjLEVBQUUsU0FBcUI7UUFYakMsZ0JBQVcsR0FBYTtZQUN0QyxRQUFRO1lBQ1IsT0FBTztZQUNQLE1BQU07WUFDTixJQUFJO1lBQ0osT0FBTztZQUNQLE1BQU07WUFDTixNQUFNO1NBQ1AsQ0FBQztRQUlBLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUE5QmEsNkJBQWEsR0FBM0IsVUFBNEIsRUFBWTtRQUN0QyxPQUFNLENBQUMsVUFBQyxLQUFLO1lBQ1gsSUFBTSxLQUFLLEdBQUcsQ0FDWixLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUN6RCxDQUFDLEtBQUssQ0FBQztZQUVSLEtBQW1CLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLLEVBQUU7Z0JBQXJCLElBQU0sSUFBSSxjQUFBO2dCQUNiLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3hCLDBDQUEwQztv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