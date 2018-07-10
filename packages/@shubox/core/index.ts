import {ShuboxCallbacks} from './src/shubox_callbacks';
import {ShuboxFormCallbacks} from './src/shubox_form_callbacks';
import {ShuboxOptions} from './src/shubox_options';
import {ShuboxFormOptions} from './src/shubox_form_options';
import {mergeObject} from './src/merge_object';
import * as Dropzone from 'dropzone';

export default class Shubox {
  static instances: Array<Dropzone> = [];
  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  selector: string;
  element: HTMLElement | HTMLInputElement;
  options: any = {};

  constructor(selector: string = '.shubox', options: object = {}) {
    this.selector = selector;
    this.options = options;
    this.init(options);
  }

  init(options: object) {
    var els = document.querySelectorAll(this.selector);

    for (var i = 0; i < els.length; i++) {
      this.element = els[i] as HTMLElement;
      let callbacks = new ShuboxCallbacks(this);

      if ('INPUT' === this.element.tagName || 'TEXTAREA' === this.element.tagName) {
        let formCallbacks = new ShuboxFormCallbacks(this);
        mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
        mergeObject(callbacks, formCallbacks);
      } else {
        mergeObject(this.options, ShuboxOptions, options);
      }

      Shubox.instances[i] = new Dropzone(this.element, {
        url: 'https://localhost-4100.s3.amazonaws.com/',
        method: 'PUT',
        previewsContainer: this.options.previewsContainer,
        clickable: this.options.clickable,
        accept: callbacks.accept,
        sending: callbacks.sending,
        success: callbacks.success,
        error: callbacks.error,
        uploadprogress: callbacks.uploadProgress,
        totaluploadprogress: callbacks.totalUploadProgress,
        maxFilesize: 100000,
        maxFiles: this.options.maxFiles,
        dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
        acceptedFiles: this.options.acceptedFiles,
      });
    }
  }
}
