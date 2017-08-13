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
            previewsContainer: null,
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
        var els = document.querySelectorAll(selector);
        this.selector = selector;
        fetch_setup_1.fetchSetup(window);
        for (var index = 0; index < els.length; ++index) {
            var el = els[index];
            this.callbacks.element = el;
            if ('INPUT' === el.tagName || 'TEXTAREA' === el.tagName) {
                merge_object_1.mergeObject(this.options, this.defaultOptions, this.formOptions, {});
                merge_object_1.mergeObject(this.callbacks, this.defaultCallbacks, this.formCallbacks);
            }
            else {
                merge_object_1.mergeObject(this.options, this.defaultOptions, {});
                merge_object_1.mergeObject(this.callbacks, this.defaultCallbacks);
            }
            Shubox.instances[index] = new window.Dropzone(el, {
                url: 'https://localhost-4100.s3.amazonaws.com/',
                uploadMethod: 'PUT',
                previewsContainer: this.options.previewsContainer,
                previewTemplate: this.options.previewTemplate,
                clickable: this.options.clickable,
                accept: this.callbacks.accept,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                error: this.callbacks.error,
                uploadprogress: this.callbacks.uploadProgress,
                totaluploadprogress: this.callbacks.totalUploadProgress,
                maxFilesize: 100000,
                maxFiles: this.options.maxFiles,
                dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
                acceptedFiles: this.options.acceptedFiles
            });
        }
    }
    Shubox.instances = [];
    return Shubox;
}());
exports.Shubox = Shubox;
