import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import { uploadCompleteEvent } from './upload_complete_event';
var ShuboxCallbacks = /** @class */ (function () {
    function ShuboxCallbacks() {
    }
    ShuboxCallbacks.prototype.accept = function (file, done) {
        fetch('http://localhost:4101/signatures', {
            method: 'post',
            mode: 'cors',
            body: objectToFormData({
                file: {
                    upload_name: this.element.dataset.shuboxTransform || '',
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
        this.element.classList.add('shubox-uploading');
        var keys = Object.keys(file.postData);
        keys.forEach(function (key) {
            var val = file.postData[key];
            formData.append(key, val);
        });
    };
    ShuboxCallbacks.prototype.success = function (file, response) {
        this.element.classList.add('shubox-success');
        this.element.classList.remove('shubox-uploading');
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
        this.element.classList.remove('shubox-uploading');
        this.element.classList.add('shubox-error');
        window.Dropzone.prototype.defaultOptions.error(file, message);
        if (this.options.error) {
            this.options.error(file, message);
        }
    };
    ShuboxCallbacks.prototype.uploadProgress = function (file, progress, bytesSent) {
        this.element.dataset.shuboxProgress = String(progress);
        window.Dropzone.prototype.defaultOptions.uploadprogress(file, progress, bytesSent);
    };
    ShuboxCallbacks.prototype.totalUploadProgress = function (totalProgress, totalBytes, totalBytesSent) {
        this.element.dataset.shuboxTotalProgress = String(totalProgress);
        window.Dropzone.prototype.defaultOptions.totaluploadprogress(totalProgress, totalBytes, totalBytesSent);
    };
    return ShuboxCallbacks;
}());
export { ShuboxCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2NhbGxiYWNrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X2NhbGxiYWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUk1RDtJQUFBO0lBeUZBLENBQUM7SUFyRkMsZ0NBQU0sR0FBTixVQUFPLElBQUksRUFBRSxJQUFJO1FBQ2YsS0FBSyxDQUFDLGtDQUFrQyxFQUFFO1lBQ3hDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3JCLElBQUksRUFBRTtvQkFDSixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLEVBQUU7b0JBQ3ZELElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7aUJBQ2hCO2dCQUNELElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQztTQUNILENBQUM7YUFDQyxJQUFJLENBQUMsVUFBQSxRQUFRO1lBQ1osT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUNSLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxpQ0FBK0IsSUFBSSxDQUFDLGFBQWUsQ0FBQyxD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