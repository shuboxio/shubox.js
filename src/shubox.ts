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

  init(selector: string): (this: HTMLElement, ev: Event) => any {
    return function(this, ev) {
      return 'done';
    };
  }

  constructor(selector: string) {
    fetchSetup(window);

    if (!window.Dropzone) {
      let dropzoneJs = document.createElement('script');
      dropzoneJs.src =
        'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.1.0/min/dropzone.min.js';
      dropzoneJs.id = 'dropzone_script';
      dropzoneJs.onload = this.init(selector);
      document.head.appendChild(dropzoneJs);
    }
  }
}
