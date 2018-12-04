import {objectToFormData} from './object_to_form_data';
import {filenameFromFile} from './filename_from_file';
import {uploadCompleteEvent} from './upload_complete_event';
import {insertAtCursor} from './insert_at_cursor';
import {TransformCallback} from './transform_callback'
import Dropzone from 'dropzone';
import Shubox from 'shubox';

declare var window: any;

export interface ShuboxDefaultOptions {
  success?: (file: Dropzone.DropzoneFile) => void;
  error?: (file: Dropzone.DropzoneFile, message: string) => void;
  sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: any) => void;
  addedfile?: (file: Dropzone.DropzoneFile) => void;
  textBehavior?: string;
  s3urlTemplate?: string;
  successTemplate?: string;
  acceptedFiles?: string;
  clickable?: boolean;
  previewsContainer?: null | string | HTMLElement;
  dictMaxFilesExceeded?: string;
  maxFiles?: null | number;
  extraParams?: object;
  transformName?: null | string;
}

export class ShuboxCallbacks {
  public shubox: Shubox;
  private options: ShuboxDefaultOptions;
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
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.error) {
              this.shubox.callbacks.error(file, json.error)
            } else {
              Shubox.instances.forEach(dz => {
                (dz as any).options.url = json.aws_endpoint;
              });

              file.postData = json;
              file.s3 = json.key;
              done();
            }
          })
          .catch((err) => {
            this.shubox.callbacks.error(file, err.message)
          });
      }.bind(this),

      sending: (file, xhr, formData) => {
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

        // Run user's provided sending callback
        this.shubox.options.sending(file, xhr, formData);
      },

      addedfile: (file) => {
        if(Dropzone.prototype.defaultOptions.addedfile) {
          Dropzone.prototype.defaultOptions.addedfile(file);
        }
        this.shubox.options.addedfile(file);
      },

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

        if (this.shubox.options.transformCallbacks) {
          let callbacks = this.shubox.options.transformCallbacks;

          for(let variant in callbacks) {
            let callback = callbacks[variant]
            new TransformCallback(file, variant, callback).run()
          }
        }

        // If supplied, run the options callback
        if (this.shubox.options.success) {
          this.shubox.options.success(file);
        }
      }.bind(this),

      error: (file, message) => {
        this.shubox.element.classList.remove('shubox-uploading');
        this.shubox.element.classList.add('shubox-error');

        let xhr = new XMLHttpRequest(); // bc type signature
        Dropzone.prototype.defaultOptions.error!(file, message, xhr);

        if (this.shubox.options.error) {
          this.shubox.options.error(file, message);
        }
      },

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

    // If we're processing the successTemplate, and the user instead used
    // the deprecated "s3urlTemplate" option, then rename the template name
    // to use that one as the key.
    if(templateName == 'successTemplate' && this.shubox.options.s3urlTemplate) {
      window.console && window.console.warn(
        `DEPRECATION: The "s3urlTemplate" will be deprecated by version 1.0. Please update to "successTemplate".`
      )

      templateName = 's3urlTemplate'
    }

    if (this.shubox.options[templateName]){
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
