import {insertAtCursor} from './src/insert_at_cursor';
import {ShuboxCallbacks} from './src/shubox_callbacks';
import {mergeObject} from './src/merge_object';
import * as Dropzone from 'dropzone';

export class Shubox {
  static instances: Array<Dropzone> = [];

  signatureUrl: string = 'https://api.shubox.io/signatures';
  uploadUrl: string = 'https://api.shubox.io/uploads';
  selector: string;
  options: any = {};
  formOptions: object = {previewsContainer: false};
  callbacks: ShuboxCallbacks = new ShuboxCallbacks();

  init(selector: string) {
    let els = document.querySelectorAll(selector);

    for (let i = 0; i < els.length; ++i) {
      let el = els[i] as HTMLElement;

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

  constructor(selector: string = '.shubox') {
    this.selector = selector;

    this.init(selector);
  }
}
