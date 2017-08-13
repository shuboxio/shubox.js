"use strict";
exports.__esModule = true;
var object_to_form_data_1 = require("../object_to_form_data");
var filename_from_file_1 = require("../filename_from_file");
var upload_complete_event_1 = require("../upload_complete_event");
var ShuboxCallbacks = (function () {
    function ShuboxCallbacks() {
    }
    ShuboxCallbacks.prototype.accept = function (file, done) {
        fetch('http://localhost:4101/signatures', {
            method: 'post',
            mode: 'cors',
            body: object_to_form_data_1.objectToFormData({
                file: {
                    upload_name: this.element.dataset.shuboxTransform || '',
                    name: filename_from_file_1.filenameFromFile(file),
                    type: file.type,
                    size: file.size
                },
                uuid: 'UUID'
            })
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
        })["catch"](function (err) {
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
        var url = /\<Location\>(.*)\<\/Location\>/g.exec(response)[1];
        file.s3url = url.replace(/%2F/g, '/');
        upload_complete_event_1.uploadCompleteEvent(file, {});
        window.Dropzone.prototype.defaultOptions.success(file);
        this.options.success(file);
    };
    ShuboxCallbacks.prototype.error = function (file, message) {
        this.element.classList.remove('shubox-uploading');
        this.element.classList.add('shubox-error');
        window.Dropzone.prototype.defaultOptions.error(file, message);
        this.options.error(file, message);
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
exports.ShuboxCallbacks = ShuboxCallbacks;
