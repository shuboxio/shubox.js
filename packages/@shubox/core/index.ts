import {insertAtCursor} from './src/insert_at_cursor';
import {ShuboxCallbacks} from './src/shubox_callbacks';
import {ShuboxOptions} from './src/shubox_options';
import {ShuboxFormOptions} from './src/shubox_form_options';
import {mergeObject} from './src/merge_object';
import * as Dropzone from 'dropzone';

export default class Shubox {
  static instances: Array<Dropzone> = [];

  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  selector: string;
  options: any = {};
  callbacks: ShuboxCallbacks = new ShuboxCallbacks();

  constructor(selector: string = '.shubox', options: object = {}) {
    this.selector = selector;
    this.init(options);
  }

  init(options: object) {
    var els = document.querySelectorAll(this.selector);

    for (var i = 0; i < els.length; i++) {
      let el = els[i] as HTMLElement;

      if ('INPUT' === el.tagName || 'TEXTAREA' === el.tagName) {
        mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
        mergeObject(this.callbacks, this.formCallbacks);
      } else {
        mergeObject(this.options, ShuboxOptions, options);
        mergeObject(this.callbacks);
      }

      Shubox.instances[i] = new Dropzone(el, {
        url: 'https://localhost-4100.s3.amazonaws.com/',
        method: 'PUT',
        previewsContainer: this.options.previewsContainer,
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
