import {objectToFormData} from '../object_to_form_data';
import {filenameFromFile} from '../filename_from_file';
import {uploadCompleteEvent} from '../upload_complete_event';

declare var window: any;

export class ShuboxCallbacks {
  private element: HTMLElement | HTMLInputElement;
  private options: Shubox.DefaultOptions;

  accept(file, done) {
    fetch('http://localhost/api/signature', {
      method: 'post',
      mode: 'cors',
      body: objectToFormData({
        file: {
          upload_name: this.element.dataset.shuboxTransform || '',
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
  }

  sending(file, xhr, formData) {
    this.element.classList.add('shubox-uploading');

    let keys = Object.keys(file.postData);
    keys.forEach(function(key) {
      let val = file.postData[key];
      formData.append(key, val);
    });
  }

  success(file, response) {
    this.element.classList.add('shubox-success');
    this.element.classList.remove('shubox-uploading');

    let url = /\<Location\>(.*)\<\/Location\>/g.exec(response)[1];
    file.s3url = url.replace(/%2F/g, '/');

    uploadCompleteEvent(file, {});
    window.Dropzone.prototype.defaultOptions.success(file);
    this.options.success(file);
  }

  error(file, message) {
    this.element.classList.remove('shubox-uploading');
    this.element.classList.add('shubox-error');

    window.Dropzone.prototype.defaultOptions.error(file, message);
    this.options.error(file, message);
  }

  uploadProgress(file, progress, bytesSent) {
    this.element.dataset.shuboxProgress = String(progress);
    window.Dropzone.prototype.defaultOptions.uploadprogress(
      file,
      progress,
      bytesSent,
    );
  }

  totalUploadProgress(totalProgress, totalBytes, totalBytesSent) {
    this.element.dataset.shuboxTotalProgress = String(totalProgress);
    window.Dropzone.prototype.defaultOptions.totaluploadprogress(
      totalProgress,
      totalBytes,
      totalBytesSent,
    );
  }
}
