var shu = (function (exports) {
'use strict';

function fetchSetup(window) {
    if (!window.fetch) {
        var fetchJs = document.createElement('script');
        fetchJs.src =
            'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js';
        fetchJs.id = 'fetch_script';
        document.head.appendChild(fetchJs);
    }
}

function objectToFormData(obj, form, namespace) {
    var formData = form || new window.FormData();
    var formKey;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + '[' + property + ']';
            }
            else {
                formKey = property;
            }
            // if the property is an object/hash, and not a File,
            if (typeof obj[property] === 'object' &&
                !(obj[property] instanceof window.File)) {
                objectToFormData(obj[property], formData, property);
            }
            else {
                formData.append(formKey, obj[property]);
            }
        }
    }
    return formData;
}

function filenameFromFile(file, date) {
    if (!file.name) {
        var now = date || new Date();
        // date
        var daynum = now.getDate();
        var day = daynum < 10 ? "0" + daynum : String(daynum);
        var monthnum = now.getMonth() + 1;
        var month = monthnum < 10 ? "0" + monthnum : String(monthnum);
        var year = now.getFullYear();
        // time
        var hour = now.getHours();
        var minutenum = now.getMinutes();
        var minute = minutenum < 10 ? "0" + minutenum : String(minutenum);
        var secondnum = now.getSeconds();
        var second = secondnum < 10 ? "0" + secondnum : String(secondnum);
        var datetime = day + "." + month + "." + year + "-" + hour + "." + minute + "." + second;
        file.name = "paste-" + datetime + ".jpg";
    }
    return file.name;
}

function uploadCompleteEvent(file, extraParams) {
    fetch('https://localhost:4101/uploads', {
        method: 'post',
        mode: 'cors',
        body: objectToFormData({
            extraParams: extraParams,
            bucket: 'localhost-4100',
            uploaded: {
                width: file.width,
                height: file.height,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: filenameFromFile(file),
                s3Path: file.s3,
                s3Url: file.s3url,
                size: file.size,
                type: file.type
            }
        })
    }).catch(function (err) {
        console.log('There was a problem with your request:' + err.message);
    });
}

var ShuboxCallbacks = (function () {
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
        var url = /\<Location\>(.*)\<\/Location\>/g.exec(response)[1];
        file.s3url = url.replace(/%2F/g, '/');
        uploadCompleteEvent(file, {});
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

function mergeObject() {
    var target = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        target[_i - 0] = arguments[_i];
    }
    var builtHash = {};
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        for (var key in arg) {
            if (arg.hasOwnProperty(key)) {
                builtHash[key] = arg[key];
            }
        }
    }
    return builtHash;
}

///<reference path="../typings/shubox" />
var Shubox = (function () {
    function Shubox(selector) {
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.callbacks = new ShuboxCallbacks();
        this.defaultOptions = {
            success: function (file) { },
            error: function (file, error) { },
            textBehavior: 'replace',
            s3urlTemplate: '{{s3url}}',
            acceptedFiles: 'image/*',
            clickable: true,
            dictMaxFilesExceeded: 'Your file limit of {{maxFiles}} file(s) has been reached.',
            maxFiles: null,
            extraParams: {}
        };
        this.defaultCallbacks = {
            accept: this.callbacks.accept,
            sending: this.callbacks.sending,
            success: this.callbacks.success,
            error: this.callbacks.error,
            uploadProgress: this.callbacks.uploadProgress,
            totalUploadProgress: this.callbacks.totalUploadProgress
        };
        this.formCallbacks = {};
        fetchSetup(window);
        if (!window.Dropzone) {
            var dropzoneJs = document.createElement('script');
            dropzoneJs.src =
                'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.1.0/min/dropzone.min.js';
            dropzoneJs.id = 'dropzone_script';
            dropzoneJs.onload = this.init(selector);
            document.head.appendChild(dropzoneJs);
        }
        else {
            this.init(selector)();
        }
    }
    Shubox.prototype.init = function (selector) {
        var _this = this;
        var els = document.querySelectorAll(selector);
        this.selector = selector;
        return function () {
            for (var index = 0; index < els.length; ++index) {
                var el = els[index];
                _this.callbacks.element = el;
                if ('INPUT' === el.tagName || 'TEXTAREA' === el.tagName) {
                    _this.options = mergeObject(_this.options, _this.defaultOptions, _this.formOptions, {});
                    _this.callbacks = mergeObject(_this.callbacks, _this.defaultCallbacks, _this.formCallbacks);
                }
                else {
                    _this.options = mergeObject(_this.options, _this.defaultOptions, {});
                    _this.callbacks = mergeObject(_this.callbacks, _this.defaultCallbacks);
                }
                Shubox.instances[index] = new window.Dropzone(el, {
                    url: 'https://localhost-4100.s3.amazonaws.com/',
                    uploadMethod: 'PUT',
                    previewsContainer: _this.options.previewsContainer,
                    clickable: _this.options.clickable,
                    accept: _this.callbacks.accept,
                    sending: _this.callbacks.sending,
                    success: _this.callbacks.success,
                    error: _this.callbacks.error,
                    uploadprogress: _this.callbacks.uploadProgress,
                    totaluploadprogress: _this.callbacks.totalUploadProgress,
                    maxFilesize: 100000,
                    maxFiles: _this.options.maxFiles,
                    dictMaxFilesExceeded: _this.options.dictMaxFilesExceeded,
                    acceptedFiles: _this.options.acceptedFiles
                });
            }
        };
    };
    Shubox.instances = [];
    return Shubox;
}());

exports.Shubox = Shubox;

return exports;

}({}));
var Shubox = shu.Shubox;