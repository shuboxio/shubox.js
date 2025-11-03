import Shubox from './Shubox';
import type { ShuboxDropzoneFile } from './types';

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  public toHash() {
    return {
      acceptedFiles: 'image/*',
      addedfile(file: ShuboxDropzoneFile) {},
      cdn: null,
      error(file: ShuboxDropzoneFile, message: string | Error) {},
      extraParams: {},
      previewsContainer:
        ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      s3Key: null,
      sending(file: ShuboxDropzoneFile, xhr: XMLHttpRequest, formData: FormData) {},
      success(file: ShuboxDropzoneFile) {},
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transformName: null,
      transforms: null,
      uploadingTemplate: '',
    };
  }
}
