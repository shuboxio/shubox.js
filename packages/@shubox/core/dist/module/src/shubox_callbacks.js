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
        var _this = this;
        var _hash = {
            accept: function (file, done) {
                var _this = this;
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
                    if (json.error) {
                        _this.shubox.callbacks.error(file, json.error);
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
                    _this.shubox.callbacks.error(file, err.message);
                });
            }.bind(this),
            sending: function (file, xhr, formData) {
                _this.shubox.element.classList.add('shubox-uploading');
                // Update the form value if it is able
                if (_this._isFormElement()) {
                    _this._updateFormValue(file, 'uploadingTemplate');
                }
                var keys = Object.keys(file.postData);
                keys.forEach(function (key) {
                    var val = file.postData[key];
                    formData.append(key, val);
                });
                // Run user's provided sending callback
                _this.shubox.options.sending(file, xhr, formData);
            },
            addedfile: function (file) {
                if (Dropzone.prototype.defaultOptions.addedfile) {
                    Dropzone.prototype.defaultOptions.addedfile(file);
                }
                _this.shubox.options.addedfile(file);
            },
            queuecomplete: function () {
                if (Dropzone.prototype.defaultOptions.queuecomplete) {
                    Dropzone.prototype.defaultOptions.queuecomplete();
                }
                _this.shubox.options.queuecomplete();
            },
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
                _this.shubox.element.classList.remove('shubox-uploading');
                _this.shubox.element.classList.add('shubox-error');
                var xhr = new XMLHttpRequest(); // bc type signature
                Dropzone.prototype.defaultOptions.error(file, message, xhr);
                if (_this.shubox.options.error) {
                    _this.shubox.options.error(file, message);
                }
            },
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
        // If we're processing the successTemplate, and the user instead used
        // the deprecated "s3urlTemplate" option, then rename the template name
        // to use that one as the key.
        if (templateName == 'successTemplate' && this.shubox.options.s3urlTemplate) {
            window.console && window.console.warn("DEPRECATION: The \"s3urlTemplate\" will be deprecated by version 1.0. Please update to \"successTemplate\".");
            templateName = 's3urlTemplate';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUE7QUFDdEQsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQXNCNUI7SUE0QkUseUJBQVksTUFBYztRQXpCakIsZ0JBQVcsR0FBbUI7WUFDckMsUUFBUTtZQUNSLE9BQU87WUFDUCxNQUFNO1lBQ04sSUFBSTtZQUNKLE9BQU87WUFDUCxNQUFNO1lBQ04sTUFBTTtTQUNQLENBQUM7UUFrQkEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQWpCTSw2QkFBYSxHQUFwQixVQUFxQixFQUFZO1FBQy9CLE9BQU0sQ0FBQyxVQUFTLEtBQUs7WUFDbkIsSUFBSSxLQUFLLEdBQUcsQ0FDVixLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUN6RCxDQUFDLEtBQUssQ0FBQztZQUVSLEtBQWlCLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO2dCQUFqQixJQUFJLElBQUksY0FBQTtnQkFDWCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUN4QiwwQ0FBMEM7b0JBQzFDLEVBQUUsQ0FBQyxP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