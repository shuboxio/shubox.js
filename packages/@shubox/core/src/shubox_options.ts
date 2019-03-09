import Shubox from 'shubox';

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  toHash() {
    return {
      cdn: null,
      addedfile: function(file) {},
      error: function(file, message) {},
      sending: function(file, xhr, formData) {},
      success: function(file) {},
      textBehavior: 'replace',
      successTemplate: '{{s3url}}',
      uploadingTemplate: '',
      acceptedFiles: 'image/*',
      s3Key: null,
      previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      transformName: null,
      extraParams: {},
    }
  }
}
