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
      previewTemplate: `<div class="dz-preview dz-file-preview">
          <div class="dz-details">
            <div class="dz-filename"><span data-dz-name></span></div>
            <div class="dz-size" data-dz-size></div>
            <img data-dz-thumbnail />
          </div>
          <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
          <div class="dz-success-mark"><span>✔</span></div>
          <div class="dz-error-mark"><span>✘</span></div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>
        </div>`,
      previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      transformName: null,
      dictMaxFilesExceeded:
        'Your file limit of {{maxFiles}} file(s) has been reached.',
      maxFiles: null,
      extraParams: {},
    }
  }
}
