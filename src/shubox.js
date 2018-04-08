"use strict";
///<reference path="../typings/shubox" />
exports.__esModule = true;
var fetch_setup_1 = require("./lib/fetch_setup");
var callbacks_1 = require("./lib/shubox/callbacks");
var merge_object_1 = require("./lib/merge_object");
var Shubox = (function () {
    function Shubox(selector) {
        this.options = {};
        this.formOptions = { previewsContainer: false };
        this.callbacks = new callbacks_1.ShuboxCallbacks();
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
        fetch_setup_1.fetchSetup(window);
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
                    _this.options = merge_object_1.mergeObject(_this.options, _this.defaultOptions, _this.formOptions, {});
                    _this.callbacks = merge_object_1.mergeObject(_this.callbacks, _this.defaultCallbacks, _this.formCallbacks);
                }
                else {
                    _this.options = merge_object_1.mergeObject(_this.options, _this.defaultOptions, {});
                    _this.callbacks = merge_object_1.mergeObject(_this.callbacks, _this.defaultCallbacks);
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
