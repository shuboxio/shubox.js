import {ShuboxCallbacks} from './src/shubox_callbacks';
import {ShuboxOptions} from './src/shubox_options';
import Dropzone from 'dropzone';

export default class Shubox {
  static instances: Array<Dropzone> = [];
  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  key: string = '';
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
      this.key = options['uuid'];
      delete options['uuid'];
    }

    if (options['key']) {
      this.key = options['key'];
      delete options['key'];
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

      let dzOptions = {
        url: 'http://localhost',
        previewsContainer: this.options.previewsContainer,
        acceptedFiles: this.options.acceptedFiles,

        // callbacks that we need to delegate to. In some cases there's work
        // needing to be passed through to Shubox's handler, and sometimes
        // the Dropbox handler, _in addition to_ the callback the user provides.
        accept: this.callbacks.accept,
        addedfile: this.callbacks.addedfile,
        sending: this.callbacks.sending,
        success: this.callbacks.success,
        error: this.callbacks.error,
        uploadprogress: this.callbacks.uploadProgress,
      }
      let dropzone = new Dropzone(this.element, { ...options, ...dzOptions });
      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);
    }
  }
}
