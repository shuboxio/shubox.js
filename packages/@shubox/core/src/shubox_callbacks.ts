import {objectToFormData} from './object_to_form_data';
import {filenameFromFile} from './filename_from_file';
import {uploadCompleteEvent} from './upload_complete_event';
import Dropzone from 'dropzone';
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
        fetch(this.shubox.signatureUrl, {
          method: 'post',
          mode: 'cors',
          body: objectToFormData({
            file: {
              name: filenameFromFile(file),
              type: file.type,
              size: file.size,
            },
            uuid: this.shubox.uuid,
          }),
        })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          if (json.error_message) {
            console.log(json.error_message);
            done(`Error preparing the upload: ${json.error_message}`);
          } else {
            Shubox.instances.forEach(dz => {
              (dz as any).options.url = json.aws_endpoint
            });

            file.postData = json;
            file.s3 = json.key;
            done();
          }
        }.bind(this))
        .catch(function (err) {
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

        uploadCompleteEvent(this.shubox, file, {});
        Dropzone.prototype.defaultOptions.success!(file, response);

        if (this.shubox.options.success) {
          this.shubox.options.success(file);
        }
      }.bind(this),

      error: function (file, message) {
        this.shubox.element.classList.remove('shubox-uploading');
        this.shubox.element.classList.add('shubox-error');
        let xhr = new XMLHttpRequest(); // bc type signature

        Dropzone.prototype.defaultOptions.error!(file, message, xhr);

        if (this.shubox.options.error) {
          this.shubox.options.error(file, message);
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
