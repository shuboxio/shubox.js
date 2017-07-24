"use strict";
/// <reference types="../typings/shubox"/>
exports.__esModule = true;
var fetch_setup_1 = require("./lib/fetch_setup");
var callbacks_1 = require("./lib/shubox/callbacks");
var mergeObject_1 = require("./lib/mergeObject");
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
            if ('INPUT' === el.tagName || 'TEXTAREA' === el.tagName) {
                mergeObject_1.mergeObject(this.options, this.defaultOptions, this.formOptions, {});
                mergeObject_1.mergeObject(this.callbacks, this.defaultCallbacks, this.formCallbacks);
            }
            else {
                mergeObject_1.mergeObject(this.options, this.defaultOptions, {});
                mergeObject_1.mergeObject(this.callbacks, this.defaultCallbacks);
            }
            Shubox.instances[index] = new window.Dropzone(el, {
                url: '%AWS_ENDPOINT%',
                uploadMethod: 'PUT',
                previewsContainer: this.options.previewsContainer,
                previewTemplate: this.options.previewTemplate,
                clickable: this.options.clickable,
                accept: this.callbacks.accept,
                sending: this.callbacks.sending,
                success: this.callbacks.success,
                error: this.callbacks.error,
                uploadprogress: this.callbacks.uploadprogress,
                totaluploadprogress: this.callbacks.totaluploadprogress,
                maxFilesize: 100000,
                maxFiles: this.options.maxFiles,
                dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
                acceptedFiles: this.options.acceptedFiles
            });
            if (typeof onAddedfile != 'undefined') {
                Shubox.instances[index].on('addedfile', onAddedfile);
            }
            if (typeof onQueueComplete != 'undefined') {
                Shubox.instances[index].on('queuecomplete', onQueueComplete);
            }
        } // end els for loop
    }
    return Shubox;
}());
exports.Shubox = Shubox;
