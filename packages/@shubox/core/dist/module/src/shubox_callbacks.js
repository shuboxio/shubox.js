import * as Dropzone from 'dropzone';
import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
        this.shubox = shubox;
    }
    ShuboxCallbacks.prototype.toHash = function () {
        return {
            accept: function (file, done) {
                fetch('http://localhost:4101/signatures', {
                    method: 'post',
                    mode: 'cors',
                    body: objectToFormData({
                        file: {
                            upload_name: this.shubox.element.dataset.shuboxTransform || '',
                            name: filenameFromFile(file),
                            type: file.type,
                            size: file.size,
                        },
                        uuid: 'UUID',
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
                        file.postData = json;
                        file.s3 = json.key;
                        done();
                    }
                })
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
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
                var url = match[1];
                file.s3url = url.replace(/%2F/g, '/');
                uploadCompleteEvent(file, {});
                Dropzone.prototype.defaultOptions.success(file, response);
                if (this.options.success) {
                    this.options.success(file);
                }
            }.bind(this),
            error: function (file, message) {
                this.shubox.element.classList.remove('shubox-uploading');
                this.shubox.element.classList.add('shubox-error');
                var xhr = new XMLHttpRequest(); // bc type signature
                Dropzone.prototype.defaultOptions.error(file, message, xhr);
                if (this.options.error) {
                    this.options.error(file, message);
                }
            }.bind(this),
            uploadProgress: function (file, progress, bytesSent) {
                this.shubox.element.dataset.shuboxProgress = String(progress);
                Dropzone.prototype.defaultOptions.uploadprogress(file, progress, bytesSent);
            }.bind(this),
            totalUploadProgress: function (totalProgress, totalBytes, totalBytesSent) {
                this.shubox.element.dataset.shuboxTotalProgress = String(totalProgress);
                Dropzone.prototype.defaultOptions.totaluploadprogress(totalProgress, totalBytes, totalBytesSent);
            }.bind(this)
        };
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUs1RDtJQUlFLHlCQUFZLE1BQWM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFNLEdBQU47UUFDRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLFVBQVUsSUFBSSxFQUFFLElBQUk7Z0JBQzFCLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRTtvQkFDeEMsTUFBTSxFQUFFLE1BQU07b0JBQ2QsSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFLGdCQUFnQixDQUFDO3dCQUNyQixJQUFJLEVBQUU7NEJBQ0osV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksRUFBRTs0QkFDOUQsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQzs0QkFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJOzRCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTt5QkFDaEI7d0JBQ0QsSUFBSSxFQUFFLE1BQU07cUJBQ2IsQ0FBQztpQkFDSCxDQUFDO3FCQUNELElBQUksQ0FBQyxVQUFBLFFBQVE7b0JBQ1osT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsVUFBQSxJQUFJ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