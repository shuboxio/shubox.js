import {insertAtCursor} from './insert_at_cursor';
import * as Dropzone from 'dropzone';
import Shubox from 'shubox';

export class ShuboxFormCallbacks {
  public shubox: Shubox;
  // private options: ShuboxDefaultOptions;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  success(file, response){
    this.shubox.element.classList.add('shubox-success');
    this.shubox.element.classList.remove('shubox-uploading');

    // let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
    // let url = match[1];
    // url = url.replace(/%2F/g, '/');
    // file.s3url = url;
    // file.transformName = (this.options.transformName || this.shubox.element.dataset.shuboxTransform || "")
    //
    // let s3urlInterpolated = this.options.s3urlTemplate || ''
    // s3urlInterpolated = s3urlInterpolated.replace('{{s3url}}', url);
    //
    // if(this.shubox.element.tagName == 'TEXTAREA' && this.options.textBehavior == 'insertAtCursor') {
    //   insertAtCursor(this.shubox.element, s3urlInterpolated);
    // } else if(this.options.textBehavior == 'append'){
    //   this.shubox.element.value = this.shubox.element.value + s3urlInterpolated;
    // } else {
    //   this.shubox.element.value = s3urlInterpolated;
    // }
    //
    // // self.uploadWebhook(file);
    // Dropzone.prototype.defaultOptions.success(file);
    // this.options.success(file);
    // // this.fileName = '';
  }
}
