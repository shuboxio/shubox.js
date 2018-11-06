import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
import { insertAtCursor } from './insert_at_cursor';
import Dropzone from 'dropzone';
import Shubox from 'shubox';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
        this.shubox = shubox;
    }
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
                var keys = Object.keys(file.postData);
                keys.forEach(function (key) {
                    var val = file.postData[key];
                    formData.append(key, val);
                });
            }.bind(this),
            success: function (file, response) {
                this.shubox.element.classList.add('shubox-success');
                this.shubox.element.classList.remove('shubox-uploading');
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || [
                    '',
                    '',
                ];
                var url = match[1];
                file.s3url = url.replace(/%2F/g, '/');
                uploadCompleteEvent(this.shubox, file, {});
                Dropzone.prototype.defaultOptions.success(file, response);
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
        if (['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) > -1) {
            _hash.success = this.formSuccess.bind(this);
        }
        return _hash;
    };
    ShuboxCallbacks.prototype.formSuccess = function (file, response) {
        var el = this.shubox.element;
        el.classList.add('shubox-success');
        el.classList.remove('shubox-uploading');
        var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        file.s3url = match[1].replace(/%2F/g, '/');
        file.transformName =
            this.shubox.options.transformName || el.dataset.shuboxTransform || '';
        var s3urlInterpolated = this.shubox.options.s3urlTemplate || '';
        s3urlInterpolated = s3urlInterpolated.replace('{{s3url}}', file.s3url);
        if (el.tagName == 'TEXTAREA' &&
            this.shubox.options.textBehavior == 'insertAtCursor') {
            insertAtCursor(el, s3urlInterpolated);
        }
        else if (this.shubox.options.textBehavior == 'append') {
            el.value = el.value + s3urlInterpolated;
        }
        else {
            el.value = s3urlInterpolated;
        }
        Dropzone.prototype.defaultOptions.success(file, {});
        this.shubox.options.success(file);
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxRQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ2hDLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUk1QjtJQUlFLHlCQUFZLE1BQWM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFNLEdBQU47UUFDRSxJQUFJLEtBQUssR0FBRztZQUNWLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRSxJQUFJO2dCQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7b0JBQzlCLE1BQU0sRUFBRSxNQUFNO29CQUNkLElBQUksRUFBRSxNQUFNO29CQUNaLElBQUksRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDckIsSUFBSSxFQUFFOzRCQUNKLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7NEJBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTs0QkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7eUJBQ2hCO3dCQUNELElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7cUJBQ3ZCLENBQUM7aUJBQ0gsQ0FBQztxQkFDQyxJQUFJLENBQUMsVUFBUyxRQUFRO29CQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUs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