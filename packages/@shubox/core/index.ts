import {ShuboxCallbacks} from './src/shubox_callbacks';
import {ShuboxFormCallbacks} from './src/shubox_form_callbacks';
import {ShuboxOptions} from './src/shubox_options';
import {ShuboxFormOptions} from './src/shubox_form_options';
import {mergeObject} from './src/merge_object';
import Dropzone from 'dropzone';

export default class Shubox {
  static instances: Array<Dropzone> = [];
  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  selector: string;
  element: HTMLElement | HTMLInputElement;
  options: any = {};
  callbacks: any = {};

  constructor(selector: string = '.shubox', options: object = {}) {
    this.selector = selector;

    this.init(options);
  }

  init(options: object) {
    Dropzone.autoDiscover = false;
    var els = document.querySelectorAll(this.selector);

    for (var i = 0; i < els.length; i++) {
      this.element = els[i] as HTMLElement;
      let shuboxCallbacks = new ShuboxCallbacks(this).toHash();

      if ('INPUT' === this.element.tagName || 'TEXTAREA' === this.element.tagName) {
        let shuboxFormCallbacks = new ShuboxFormCallbacks(this).toHash();
        this.options = mergeObject(this.options, ShuboxOptions, ShuboxFormOptions, options);
        this.callbacks = mergeObject(this.callbacks, shuboxCallbacks, shuboxFormCallbacks);
      } else {
        this.options = mergeObject(this.options, ShuboxOptions, options);
        this.callbacks = mergeObject(this.callbacks, shuboxCallbacks)
      }

      Shubox.instances[i] = new Dropzone(this.element, {
        url: 'https://localhost-4100.s3.amazonaws.com/',
        method: 'PUT',
        previewsContainer: this.options.previewsContainer,
        clickable: this.options.clickable,
        maxFilesize: 100000,
        maxFiles: this.options.maxFiles,
        dictMaxFilesExceeded: this.options.dictMaxFilesExceeded,
        acceptedFiles: this.options.acceptedFiles,
        accept: this.callbacks.accept,
        sending: this.callbacks.sending,
        success: this.callbacks.success,
        error: this.callbacks.error,
        uploadprogress: this.callbacks.uploadProgress,
        totaluploadprogress: this.callbacks.totalUploadProgress,
      });
    }
  }
}
