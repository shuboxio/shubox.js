import * as Dropzone from 'dropzone';
import {objectToFormData} from './object_to_form_data';
import {filenameFromFile} from './filename_from_file';
import {uploadCompleteEvent} from './upload_complete_event';
import Shubox from 'shubox';

declare var window: any;

export class ShuboxCallbacks {
  public shubox: Shubox;
  private options: Shubox.ShuboxDefaultOptions;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  toHash() {
    return {
      accept: function (file, done) {
        fetch('http://localhost:4101/signatures', {
          method: 'post',
          mode: 'cors',
          body: objectToFormData({
            file: {
              upload_name: this.shubox.element.dataset.shuboxTransform || '',
              name: filenameFromFile(file),
              type: file.type,
              size: file.size,
            },
            uuid: 'UUID',
          }),
        })
        .then(response => {
          return response.json();
        })
        .then(json => {
          if (json.error_message) {
            console.log(json.error_message);
            done(`Error preparing the upload: ${json.error_message}`);
          } else {
            file.postData = json;
            file.s3 = json.key;
            done();
          }
        })
        .catch(err => {
          console.log(`There was a problem with your request: ${err.message}`);
        });
      }.bind(this),

      sending: function (file, xhr, formData) {
        this.shubox.element.classList.add('shubox-uploading');

        let keys = Object.keys(file.postData);
        keys.forEach(function(key) {
          let val = file.postData[key];
          formData.append(key, val);
        });
      }.bind(this),

      success: function (file, response) {
        this.shubox.element.classList.add('shubox-success');
        this.shubox.element.classList.remove('shubox-uploading');
        let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        let url = match[1];
        file.s3url = url.replace(/%2F/g, '/');

        uploadCompleteEvent(file, {});
        Dropzone.prototype.defaultOptions.success!(file, response);

        if (this.options.success) {
          this.options.success(file);
        }
      }.bind(this),

      error: function (file, message) {
        this.shubox.element.classList.remove('shubox-uploading');
        this.shubox.element.classList.add('shubox-error');
        let xhr = new XMLHttpRequest(); // bc type signature

        Dropzone.prototype.defaultOptions.error!(file, message, xhr);

        if (this.options.error) {
          this.options.error(file, message);
        }
      }.bind(this),

      uploadProgress: function (file, progress, bytesSent) {
        this.shubox.element.dataset.shuboxProgress = String(progress);
        Dropzone.prototype.defaultOptions.uploadprogress!(
          file,
          progress,
          bytesSent,
        );
      }.bind(this),

      totalUploadProgress: function (totalProgress, totalBytes, totalBytesSent) {
        this.shubox.element.dataset.shuboxTotalProgress = String(totalProgress);
        Dropzone.prototype.defaultOptions.totaluploadprogress!(
          totalProgress,
          totalBytes,
          totalBytesSent,
        );
      }.bind(this)
    }
  }
}
