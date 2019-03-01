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
      queuecomplete: function() {},
      sending: function(file, xhr, formData) {},
      success: function(file) {},
      textBehavior: 'replace',
      successTemplate: '{{s3url}}',
      uploadingTemplate: '',
      acceptedFiles: 'image/*',
      clickable: true,
      s3Key: null,
      previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      transformName: null,
      dictMaxFilesExceeded:
        'Your file limit of {{maxFiles}} file(s) has been reached.',
      maxFiles: null,
      extraParams: {},
    }
  }
}
