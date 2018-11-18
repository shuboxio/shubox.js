import {objectToFormData} from './object_to_form_data';
import {filenameFromFile} from './filename_from_file';
import {uploadCompleteEvent} from './upload_complete_event';
import {insertAtCursor} from './insert_at_cursor';
import Dropzone from 'dropzone';
import Shubox from 'shubox';

declare var window: any;

export class ShuboxCallbacks {
  public shubox: Shubox;
  private options: Shubox.ShuboxDefaultOptions;
  readonly replaceable : Array<string> = [
    'height',
    'width',
    'name',
    's3',
    's3url',
    'size',
    'type',
  ];

  static pasteCallback(dz: Dropzone) {
    return(function(event){
      let items = (
        event.clipboardData || event.originalEvent.clipboardData
      ).items;

      for (let item of items) {
        if (item.kind === 'file') {
          // adds the file to your dropzone instance
          dz.addFile(item.getAsFile())
        }
      }
    })
  }

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  toHash() {
    let _hash = {
      accept: function(file, done) {
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
          .then(function(response) {
            return response.json();
          })
          .then(
            function(json) {
              if (json.error_message) {
                console.log(json.error_message);
                done(`Error preparing the upload: ${json.error_message}`);
              } else {
                Shubox.instances.forEach(dz => {
                  (dz as any).options.url = json.aws_endpoint;
                });

                file.postData = json;
                file.s3 = json.key;
                done();
              }
            }.bind(this),
          )
          .catch(function(err) {
            console.log(
              `There was a problem with your request: ${err.message}`,
            );
          });
      }.bind(this),

      sending: function(file, xhr, formData) {
        this.shubox.element.classList.add('shubox-uploading');

        // Update the form value if it is able
        if (this._isFormElement()) {
          this._updateFormValue(file, 'uploadingTemplate');
        }

        let keys = Object.keys(file.postData);
        keys.forEach(function(key) {
          let val = file.postData[key];
          formData.append(key, val);
        });
      }.bind(this),

      success: function(file, response) {
        this.shubox.element.classList.add('shubox-success');
        this.shubox.element.classList.remove('shubox-uploading');
        let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        let url   = match[1];
        file.s3url = url.replace(/%2F/g, '/');

        uploadCompleteEvent(this.shubox, file, {});
        Dropzone.prototype.defaultOptions.success!(file, response);

        // Update the form value if it is able
        if (this._isFormElement()) {
          this._updateFormValue(file, 'successTemplate');
        }

        // Run the Dropzone callback
        Dropzone.prototype.defaultOptions.success!(file, {});

        // If supplied, run the options callback
        if (this.shubox.options.success) {
          this.shubox.options.success(file);
        }
      }.bind(this),

      error: function(file, message) {
        this.shubox.element.classList.remove('shubox-uploading');
        this.shubox.element.classList.add('shubox-error');
        let xhr = new XMLHttpRequest(); // bc type signature

        Dropzone.prototype.defaultOptions.error!(file, message, xhr);

        if (this.shubox.options.error) {
          this.shubox.options.error(file, message);
        }
      }.bind(this),

      uploadProgress: function(file, progress, bytesSent) {
        this.shubox.element.dataset.shuboxProgress = String(progress);
        Dropzone.prototype.defaultOptions.uploadprogress!(
          file,
          progress,
          bytesSent,
        );
      }.bind(this),

      totalUploadProgress: function(totalProgress, totalBytes, totalBytesSent) {
        this.shubox.element.dataset.shuboxTotalProgress = String(totalProgress);
        Dropzone.prototype.defaultOptions.totaluploadprogress!(
          totalProgress,
          totalBytes,
          totalBytesSent,
        );
      }.bind(this),
    };


    return _hash;
  }

  // Private

  _updateFormValue(file, templateName) {
    let el = this.shubox.element as HTMLInputElement;
    let interpolatedText = ''

    if(templateName == 'successTemplate' && !!this.shubox.options.s3urlTemplate) {
      window.console && window.console.warn(`DEPRECATION: The "s3urlTemplate" will be deprecated by version 1.0. Please update to "successTemplate".`)

      templateName = 's3urlTemplate'
    }

    if (!!this.shubox.options[templateName]){
      interpolatedText = this.shubox.options[templateName];
    }

    for (let key of this.replaceable) {
      interpolatedText = interpolatedText.replace(`{{${key}}}`, file[key])
    }

    if (this._insertableAtCursor(el)) {
      insertAtCursor(el, interpolatedText);

    } else if (this._isAppendingText()) {
      el.value = el.value + interpolatedText;

    } else {
      el.value = interpolatedText;
    }
  }

  _isFormElement(): boolean {
    return(['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) > -1)
  }

  _isAppendingText(): boolean {
    return(this.shubox.options.textBehavior == 'append')
  }

  _insertableAtCursor(el : HTMLInputElement): boolean {
    return (
      el.tagName == 'TEXTAREA' &&
        this.shubox.options.textBehavior == 'insertAtCursor'
    )
  }
}
