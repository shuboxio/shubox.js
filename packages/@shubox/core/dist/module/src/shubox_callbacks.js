import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks(shubox) {
        this.shubox = shubox;
    }
    ShuboxCallbacks.prototype.accept = function (file, done) {
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
    };
    ShuboxCallbacks.prototype.sending = function (file, xhr, formData) {
        this.shubox.element.classList.add('shubox-uploading');
        var keys = Object.keys(file.postData);
        keys.forEach(function (key) {
            var val = file.postData[key];
            formData.append(key, val);
        });
    };
    ShuboxCallbacks.prototype.success = function (file, response) {
        this.shubox.element.classList.add('shubox-success');
        this.shubox.element.classList.remove('shubox-uploading');
        var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        var url = match[1];
        file.s3url = url.replace(/%2F/g, '/');
        uploadCompleteEvent(file, {});
        window.Dropzone.prototype.defaultOptions.success(file);
        if (this.options.success) {
            this.options.success(file);
        }
    };
    ShuboxCallbacks.prototype.error = function (file, message) {
        this.shubox.element.classList.remove('shubox-uploading');
        this.shubox.element.classList.add('shubox-error');
        window.Dropzone.prototype.defaultOptions.error(file, message);
        if (this.options.error) {
            this.options.error(file, message);
        }
    };
    ShuboxCallbacks.prototype.uploadProgress = function (file, progress, bytesSent) {
        this.shubox.element.dataset.shuboxProgress = String(progress);
        window.Dropzone.prototype.defaultOptions.uploadprogress(file, progress, bytesSent);
    };
    ShuboxCallbacks.prototype.totalUploadProgress = function (totalProgress, totalBytes, totalBytesSent) {
        this.shubox.element.dataset.shuboxTotalProgress = String(totalProgress);
        window.Dropzone.prototype.defaultOptions.totaluploadprogress(totalProgress, totalBytes, totalBytesSent);
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUs1RDtJQUlFLHlCQUFZLE1BQWM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELGdDQUFNLEdBQU4sVUFBTyxJQUFJLEVBQUUsSUFBSTtRQUNmLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRTtZQUN4QyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLGdCQUFnQixDQUFDO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0osV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksRUFBRTtvQkFDOUQsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQztvQkFDNUIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtpQkFDaEI7Z0JBQ0QsSUFBSSxFQUFFLE1BQU07YUFDYixDQUFDO1NBQ0gsQ0FBQzthQUNDLElBQUksQ0FBQyxVQUFBLFFBQVE7WUFDWixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ1IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFh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