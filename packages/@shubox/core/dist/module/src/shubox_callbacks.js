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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN2RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQXNCNUQ7SUE0QkUseUJBQVksTUFBYztRQVhWLGdCQUFXLEdBQWE7WUFDdEMsUUFBUTtZQUNSLE9BQU87WUFDUCxNQUFNO1lBQ04sSUFBSTtZQUNKLE9BQU87WUFDUCxNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUM7UUFJQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBNUJhLDZCQUFhLEdBQTNCLFVBQTRCLEVBQVk7UUFDdEMsT0FBTSxDQUFDLFVBQUMsS0FBSztZQUNYLElBQU0sS0FBSyxHQUFHLENBQ1osS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FDekQsQ0FBQyxLQUFLLENBQUM7WUFFUixLQUFtQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO2dCQUFyQixJQUFNLElBQUksY0FBQTtnQkFDYixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUN4QiwwQ0FBMEM7b0JBQzFDLEVBQUUsQ0FBQyxP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