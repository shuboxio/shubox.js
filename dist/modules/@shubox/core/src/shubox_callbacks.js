import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
import { insertAtCursor } from './insert_at_cursor';
import { TransformCallback } from './transform_callback';
import Dropzone from 'dropzone';
import Shubox from 'shubox';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
        this.replaceable = [
            'height',
            'width',
            'name',
            's3',
            's3url',
            'size',
            'type',
        ];
        this.shubox = shubox;
    }
    ShuboxCallbacks.pasteCallback = function (dz) {
        return (function (event) {
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.kind === 'file') {
                    // adds the file to your dropzone instance
                    dz.addFile(item.getAsFile());
                }
            }
        });
    };
    ShuboxCallbacks.prototype.toHash = function () {
        var _hash = {
            accept: function (file, done) {
                fetch(this.shubox.signatureUrl, {
                    method: 'post',
                    mode: 'cors',
                    body: objectToFormData({
                        file: {
                            name: filenameFromFile(file),
                            type: file.type,
                            size: file.size,
                        },
                        uuid: this.shubox.uuid,
                    }),
                })
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (json) {
                    if (json.error_message) {
                        console.log(json.error_message);
                        done("Error preparing the upload: " + json.error_message);
                    }
                    else {
                        Shubox.instances.forEach(function (dz) {
                            dz.options.url = json.aws_endpoint;
                        });
                        file.postData = json;
                        file.s3 = json.key;
                        done();
                    }
                }.bind(this))
                    .catch(function (err) {
                    console.log("There was a problem with your request: " + err.message);
                });
            }.bind(this),
            sending: function (file, xhr, formData) {
                this.shubox.element.classList.add('shubox-uploading');
                // Update the form value if it is able
                if (this._isFormElement()) {
                    this._updateFormValue(file, 'uploadingTemplate');
                }
                var keys = Object.keys(file.postData);
                keys.forEach(function (key) {
                    var val = file.postData[key];
                    formData.append(key, val);
                });
            }.bind(this),
            success: function (file, response) {
                this.shubox.element.classList.add('shubox-success');
                this.shubox.element.classList.remove('shubox-uploading');
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
                var url = match[1];
                file.s3url = url.replace(/%2F/g, '/');
                uploadCompleteEvent(this.shubox, file, {});
                Dropzone.prototype.defaultOptions.success(file, response);
                // Update the form value if it is able
                if (this._isFormElement()) {
                    this._updateFormValue(file, 'successTemplate');
                }
                // Run the Dropzone callback
                Dropzone.prototype.defaultOptions.success(file, {});
                if (this.shubox.options.transformCallbacks) {
                    var callbacks = this.shubox.options.transformCallbacks;
                    for (var variant in callbacks) {
                        var callback = callbacks[variant];
                        new TransformCallback(file, variant, callback).run();
                    }
                }
                // If supplied, run the options callback
                if (this.shubox.options.success) {
                    this.shubox.options.success(file);
                }
            }.bind(this),
            error: function (file, message) {
                this.shubox.element.classList.remove('shubox-uploading');
                this.shubox.element.classList.add('shubox-error');
                var xhr = new XMLHttpRequest(); // bc type signature
                Dropzone.prototype.defaultOptions.error(file, message, xhr);
                if (this.shubox.options.error) {
                    this.shubox.options.error(file, message);
                }
            }.bind(this),
            uploadProgress: function (file, progress, bytesSent) {
                this.shubox.element.dataset.shuboxProgress = String(progress);
                Dropzone.prototype.defaultOptions.uploadprogress(file, progress, bytesSent);
            }.bind(this),
            totalUploadProgress: function (totalProgress, totalBytes, totalBytesSent) {
                this.shubox.element.dataset.shuboxTotalProgress = String(totalProgress);
                Dropzone.prototype.defaultOptions.totaluploadprogress(totalProgress, totalBytes, totalBytesSent);
            }.bind(this),
        };
        return _hash;
    };
    // Private
    ShuboxCallbacks.prototype._updateFormValue = function (file, templateName) {
        var el = this.shubox.element;
        var interpolatedText = '';
        if (templateName == 'successTemplate' && !!this.shubox.options.s3urlTemplate) {
            window.console && window.console.warn("DEPRECATION: The \"s3urlTemplate\" will be deprecated by version 1.0. Please update to \"successTemplate\".");
            templateName = 's3urlTemplate';
        }
        if (!!this.shubox.options[templateName]) {
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
        return (['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) > -1);
    };
    ShuboxCallbacks.prototype._isAppendingText = function () {
        return (this.shubox.options.textBehavior == 'append');
    };
    ShuboxCallbacks.prototype._insertableAtCursor = function (el) {
        return (el.tagName == 'TEXTAREA' &&
            this.shubox.options.textBehavior == 'insertAtCursor');
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUE7QUFDdEQsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUk1QjtJQTRCRSx5QkFBWSxNQUFjO1FBekJqQixnQkFBVyxHQUFtQjtZQUNyQyxRQUFRO1lBQ1IsT0FBTztZQUNQLE1BQU07WUFDTixJQUFJO1lBQ0osT0FBTztZQUNQLE1BQU07WUFDTixNQUFNO1NBQ1AsQ0FBQztRQWtCQSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBakJNLDZCQUFhLEdBQXBCLFVBQXFCLEVBQVk7UUFDL0IsT0FBTSxDQUFDLFVBQVMsS0FBSztZQUNuQixJQUFJLEtBQUssR0FBRyxDQUNWLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQ3pELENBQUMsS0FBSyxDQUFDO1lBRVIsS0FBaUIsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUs7Z0JBQWpCLElBQUksSUFBSSxjQUFBO2dCQUNYLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3hCLDBDQUEwQztvQkFDMUMsRUFBRSxDQUFDLE9B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