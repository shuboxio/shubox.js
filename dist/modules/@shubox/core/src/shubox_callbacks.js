import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
import Dropzone from 'dropzone';
import Shubox from 'shubox';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
        this.shubox = shubox;
    }
    ShuboxCallbacks.prototype.toHash = function () {
        return {
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
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
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
            }.bind(this)
        };
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBSTVCO0lBSUUseUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsZ0NBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxNQUFNLEVBQUUsVUFBVSxJQUFJLEVBQUUsSUFBSTtnQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO29CQUM5QixNQUFNLEVBQUUsTUFBTTtvQkFDZCxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3JCLElBQUksRUFBRTs0QkFDSixJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDOzRCQUM1QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7NEJBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3lCQUNoQjt3QkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO3FCQUN2QixDQUFDO2lCQUNILENBQUM7cUJBQ0QsSUFBSSxDQUFDLFVBQVUsUUFBUTtvQkFDdEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQztxQkFDRCxJQUFJLENBQUMsVUFBVSxJQUFJO29CQUNs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