import * as Dropzone from 'dropzone';
import {insertAtCursor} from './insert_at_cursor';
import Shubox from 'shubox';

export class ShuboxFormCallbacks {
  public shubox: Shubox;
  public element: HTMLInputElement;
  public options: any = {};

  constructor(shubox: Shubox) {
    this.shubox = shubox;
    this.element = shubox.element as HTMLInputElement;
    this.options = shubox.options;
  }

  toHash() {
    return {
      success: function (file, response) {
        this.element.classList.add('shubox-success');
        this.element.classList.remove('shubox-uploading');

        let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        file.s3url = match[1].replace(/%2F/g, '/');
        file.transformName = (
          this.options.transformName ||
            this.element.dataset.shuboxTransform || ""
        )

        let s3urlInterpolated = this.options.s3urlTemplate || ''
        s3urlInterpolated = s3urlInterpolated.replace('{{s3url}}', file.s3url);

        if(this.element.tagName == 'TEXTAREA' && this.options.textBehavior == 'insertAtCursor') {
          insertAtCursor(this.element, s3urlInterpolated);

        } else if(this.options.textBehavior == 'append'){
          this.element.value = this.element.value + s3urlInterpolated;

        } else {
          this.element.value = s3urlInterpolated;
        }

        Dropzone.prototype.defaultOptions.success!(file, {});
        this.options.success(file);
      }.bind(this)
    }
  }
}
