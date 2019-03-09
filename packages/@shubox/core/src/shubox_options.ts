import Shubox from 'shubox';

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  toHash() {
    return {
      success: function(file) {},
      sending: function(file, xhr, formData) {},
      textBehavior: 'replace',
      successTemplate: '{{s3url}}',
      uploadingTemplate: '',
      acceptedFiles: 'image/*',
      s3Key: null,
      previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      transformName: null,
      dictMaxFilesExceeded: 'Your file limit of {{maxFiles}} file(s) has been reached.',
      extraParams: {},
      cdn: null,
    }
  }
}
