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
  previewsContainer?: null | string | HTMLElement;
  extraParams?: object;
  transformName?: null | string;
  transformCallbacks?: null | object;
  s3Key?: null | string;
  cdn?: null | string;
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
    // assigning `this` (instance of ShuboxCallbacks) to `self` to that `this`
    // inside the body of these callback functions are reserved for the
    // instance of Dropzone that fires the function.
    let self = this;

    let _hash = {
      accept: function(file, done) {
        fetch(self.shubox.signatureUrl, {
          method: 'post',
          mode: 'cors',
          body: objectToFormData({
            file: {
              name: filenameFromFile(file),
              type: file.type,
              size: file.size,
            },
            key: self.shubox.key,
            s3Key: self.shubox.options.s3Key
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.error) {
              self.shubox.callbacks.error(file, json.error)
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
            self.shubox.callbacks.error(file, err.message)
          });
      },

      sending: function(file, xhr, formData) {
        self.shubox.element.classList.add('shubox-uploading');

        // Update the form value if it is able
        if (self._isFormElement()) {
          self._updateFormValue(file, 'uploadingTemplate');
        }

        let keys = Object.keys(file.postData);
        keys.forEach(function(key) {
          let val = file.postData[key];
          formData.append(key, val);
        });

        // Run user's provided sending callback
        self.shubox.options.sending(file, xhr, formData);
      },

      addedfile: function(file) {
        Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);
        self.shubox.options.addedfile(file);
      },

      success: function(file, response) {
        self.shubox.element.classList.add('shubox-success');
        self.shubox.element.classList.remove('shubox-uploading');
        let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        let url   = match[1];
        file.s3url = url.replace(/%2F/g, '/').replace(/%2B/g, '%20');

        if (self.shubox.options.cdn) {
          let path = file.s3url.split("/").slice(4).join("/");
          file.s3url = `${self.shubox.options.cdn}/${path}`
        }

        uploadCompleteEvent(self.shubox, file, (self.shubox.options.extraParams || {}));
        Dropzone.prototype.defaultOptions.success!.apply(this, [file, response]);

        // Update the form value if it is able
        if (self._isFormElement()) {
          self._updateFormValue(file, 'successTemplate');
        }

        if (self.shubox.options.transformCallbacks) {
          let callbacks = self.shubox.options.transformCallbacks;

          for(let variant in callbacks) {
            let callback = callbacks[variant]
            new TransformCallback(file, variant, callback).run()
          }
        }

        // If supplied, run the options callback
        if (self.shubox.options.success) {
          self.shubox.options.success(file);
        }
      },

      error: function (file, message) {
        self.shubox.element.classList.remove('shubox-uploading');
        self.shubox.element.classList.add('shubox-error');

        let xhr = new XMLHttpRequest(); // bc type signature
        Dropzone.prototype.defaultOptions.error!.apply(this, [file, message, xhr]);

        if (self.shubox.options.error) {
          self.shubox.options.error(file, message);
        }
      },

      uploadProgress: function(file, progress, bytesSent) {
        self.shubox.element.dataset.shuboxProgress = String(progress);
        Dropzone.prototype.defaultOptions.uploadprogress!.apply(
          this,
          [file, progress, bytesSent]
        );
      },
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
