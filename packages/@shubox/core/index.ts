import {ShuboxCallbacks} from './src/shubox_callbacks';
import {ShuboxOptions} from './src/shubox_options';
import Dropzone from 'dropzone';

export default class Shubox {
  static instances: Array<Dropzone> = [];
  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  uuid: string = '';
  selector: string;
  element: HTMLElement | HTMLInputElement;
  options: any = {};
  callbacks: any = {};

  constructor(selector: string = '.shubox', options: object = {}) {
    this.selector = selector;

    if (options['signatureUrl']) {
      this.signatureUrl = options['signatureUrl'];
      delete options['signatureUrl'];
    }

    if (options['uploadUrl']) {
      this.uploadUrl = options['uploadUrl'];
      delete options['uploadUrl'];
    }

    if (options['uuid']) {
      this.uuid = options['uuid'];
      delete options['uuid'];
    }

    this.init(options);
  }

  init(options: object) {
    Dropzone.autoDiscover = false;
    var els = document.querySelectorAll(this.selector);

    for (var i = 0; i < els.length; i++) {
      this.element = els[i] as HTMLElement;
      this.callbacks = new ShuboxCallbacks(this).toHash();
      this.options = {
        ...this.options,
        ...(new ShuboxOptions(this).toHash()),
        ...options
      }

      let _dz = new Dropzone(this.element, {
        url: 'http://localhost',
        previewsContainer: this.options.previewsContainer,
        clickable: this.options.clickable,
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
      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(_dz));
      Shubox.instances.push(_dz);
    }
  }
}
