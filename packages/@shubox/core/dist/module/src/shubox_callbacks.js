import Dropzone from "dropzone";
import Shubox from "shubox";
import { filenameFromFile } from "./filename_from_file";
import { insertAtCursor } from "./insert_at_cursor";
import { objectToFormData } from "./object_to_form_data";
import { TransformCallback } from "./transform_callback";
import { uploadCompleteEvent } from "./upload_complete_event";
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
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
                        Shubox.instances.forEach(function (dz) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQXFCNUQ7SUE0QkUseUJBQVksTUFBYztRQVhWLGdCQUFXLEdBQWE7WUFDdEMsUUFBUTtZQUNSLE9BQU87WUFDUCxNQUFNO1lBQ04sSUFBSTtZQUNKLE9BQU87WUFDUCxNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUM7UUFJQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBNUJhLDZCQUFhLEdBQTNCLFVBQTRCLEVBQVk7UUFDdEMsT0FBTSxDQUFDLFVBQUMsS0FBSztZQUNYLElBQU0sS0FBSyxHQUFHLENBQ1osS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FDekQsQ0FBQyxLQUFLLENBQUM7WUFFUixLQUFtQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO2dCQUFyQixJQUFNLElBQUksY0FBQTtnQkFDYixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUN4QiwwQ0FBMEM7b0JBQzFDLEVBQUUsQ0FBQyxP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