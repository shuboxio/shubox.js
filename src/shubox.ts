///<reference path="../typings/shubox" />

import {fetchSetup} from './lib/fetch_setup';
import {insertAtCursor} from './lib/insert_at_cursor';
import {ShuboxCallbacks} from './lib/shubox/callbacks';
import {mergeObject} from './lib/merge_object';

declare var window: any;

export class Shubox {
  static instances: Array<Shubox> = [];

  selector: string;

  options: any = {};

  formOptions: object = {previewsContainer: false};

  callbacks: ShuboxCallbacks = new ShuboxCallbacks();

  defaultOptions: Shubox.DefaultOptions = {
    success: function(file) {},
    error: function(file, error) {},
    textBehavior: 'replace',
    s3urlTemplate: '{{s3url}}',
    acceptedFiles: 'image/*',
    clickable: true,
    previewsContainer: null,
    dictMaxFilesExceeded:
      'Your file limit of {{maxFiles}} file(s) has been reached.',
    maxFiles: null,
    extraParams: {},
  };

  defaultCallbacks: Shubox.Callbacks = {
    accept: this.callbacks.accept,
    sending: this.callbacks.sending,
    success: this.callbacks.success,
    error: this.callbacks.error,
    uploadProgress: this.callbacks.uploadProgress,
    totalUploadProgress: this.callbacks.totalUploadProgress,
  };

  formCallbacks: Shubox.FormCallbacks = {};

  constructor(selector: string) {
    let els = document.querySelectorAll(selector);
    this.selector = selector;
    fetchSetup(window);

    for (let index = 0; index < els.length; ++index) {
      let el = els[index] as HTMLElement;
      this.callbacks.element = el;

      if ('INPUT' === el.tagName || 'TEXTAREA' === el.tagName) {
        mergeObject(this.options, this.defaultOptions, this.formOptions, {});
        mergeObject(this.callbacks, this.defaultCallbacks, this.formCallbacks);
      } else {
        mergeObject(this.options, this.defaultOptions, {});
        mergeObject(this.callbacks, this.defaultCallbacks);
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
        acceptedFiles: this.options.acceptedFiles,
      });
    }
  }
}
