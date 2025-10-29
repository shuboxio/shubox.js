import Dropzone from "dropzone";
import Shubox from "./index";
import { filenameFromFile } from "./filename_from_file";
import { insertAtCursor } from "./insert_at_cursor";
import { objectToFormData } from "./object_to_form_data";
import { TransformCallback } from "./transform_callback";
import { uploadCompleteEvent } from "./upload_complete_event";

declare var window: any;

export interface IShuboxDefaultOptions {
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
  transforms?: null | object;
  transformCallbacks?: null | object;
  s3Key?: null | string;
  cdn?: null | string;
}

export class ShuboxCallbacks {

  public static pasteCallback(dz: Dropzone) {
    return ((event: ClipboardEvent) => {
      const items = (event.clipboardData)!.items;

      for (const item of items) {
        if (item.kind === "file") {
          // adds the file to your dropzone instance
          dz.addFile(item.getAsFile() as Dropzone.DropzoneFile);
        }
      }
    });
  }
  public shubox: Shubox;
  public instances: Dropzone[];
  public readonly replaceable: string[] = [
    "height",
    "width",
    "name",
    "s3",
    "s3url",
    "size",
    "type",
  ];
  // private options: IShuboxDefaultOptions;

  constructor(shubox: Shubox, instances: Dropzone[]) {
    this.shubox = shubox;
    this.instances = instances;
  }

  public toHash() {
    // assigning `this` (instance of ShuboxCallbacks) to `self` so that `this`
    // inside the body of these callback functions are reserved for the
    // instance of Dropzone that invokes the function.
    const self = this;

    const hash = {
      accept(file: any, done: any) {
        fetch(self.shubox.signatureUrl, {
          headers: { "X-Shubox-Client": self.shubox.version },
          body: objectToFormData({
            file: {
              name: filenameFromFile(file),
              size: file.size,
              type: file.type,
            },
            key: self.shubox.key,
            s3Key: self.shubox.options.s3Key,
          }),
          method: "post",
          mode: "cors"
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            if (json.error) {
              self.shubox.callbacks.error(file, json.error);
            } else {
              self.instances.forEach((dz) => {
                (dz as any).options.url = json.aws_endpoint;
              });

              file.postData = json;
              file.s3 = json.key;
              done();
            }
          })
          .catch((err) => {
            self.shubox.callbacks.error(file, err.message);
          });
      },

      sending(file: any, xhr: any, formData: any) {
        self.shubox.element.classList.add("shubox-uploading");

        // Update the form value if it is able
        if (self._isFormElement()) {
          self._updateFormValue(file, "uploadingTemplate");
        }

        const keys = Object.keys(file.postData);
        keys.forEach((key) => {
          const val = file.postData[key];
          formData.append(key, val);
        });

        // Run user's provided sending callback
        if (self.shubox.options.sending) {
          self.shubox.options.sending(file, xhr, formData);
        }
      },

      addedfile(file: any) {
        Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);
        if (self.shubox.options.addedfile) {
          self.shubox.options.addedfile(file);
        }
      },

      success(file: any, response: any) {
        self.shubox.element.classList.add("shubox-success");
        self.shubox.element.classList.remove("shubox-uploading");
        const match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ["", ""];
        const url = match[1];
        let apiVersion = 1.0
        file.s3url = url.replace(/%2F/g, "/").replace(/%2B/g, "%20");

        if (self.shubox.options.cdn) {
          const path = file.s3url.split("/").slice(4).join("/");
          file.s3url = `${self.shubox.options.cdn}/${path}`;
        }

        uploadCompleteEvent(self.shubox, file, (self.shubox.options.extraParams || {})).then(response => {
          if (!response) return;

          apiVersion = Number(response.headers.get("X-Shubox-API"));

          Dropzone.prototype.defaultOptions.success!.apply(this, [<Dropzone.DropzoneFile>file]);

          // Update the form value if it is able
          if (self._isFormElement()) {
            self._updateFormValue(file, "successTemplate");
          }

          const transformCallbacks = self.shubox.options.transformCallbacks || self.shubox.options.transforms;

          if (transformCallbacks) {
            // If using the legacy transformCallbacks option, we need to translate the variant character to the old style.
            // EG: 400x400# -> 400x400_hash
            //
            // If using the new transforms option, we don't need to do this translation.
            // EG: 400x400# -> 400x400#
            const doVariantCharacterTranslation = !!self.shubox.options.transformCallbacks;

            for (const variant of Object.keys(transformCallbacks)) {
              const callback = transformCallbacks[variant];
              new TransformCallback(file, variant, callback, apiVersion, doVariantCharacterTranslation).run();
            }
          }

          // If supplied, run the options callback
          if (self.shubox.options.success) {
            self.shubox.options.success(file);
          }
        });
      },

      error(file: any, message: any) {
        self.shubox.element.classList.remove("shubox-uploading");
        self.shubox.element.classList.add("shubox-error");

        const xhr = new XMLHttpRequest(); // bc type signature
        Dropzone.prototype.defaultOptions.error!.apply(this, [file, message, xhr]);

        if (message.includes("Referring domain not permitted") && window.location.hostname === "localhost") {
          console.log(`%cOOPS!`, "font-size: 14px; color:#7c5cd1; font-weight: bold;");
          console.log(
            `%cIt looks like you're attempting to test Shubox on localhost but are running into an issue.
You should check to make sure you're using your %c"Sandbox" %ckey while you test as it will
work with localhost.

%cFor more information and instructions: https://dashboard.shubox.io/domains/sandbox`,
            "font-size: 12px; color:#7c5cd1;",
            "font-size: 12px; color:#7c5cd1; font-weight:bold",
            "font-size: 12px; color:#7c5cd1;",
            "font-size: 13px; color:#7c5cd1; font-weight:bold;",
          );
        }

        if (self.shubox.options.error) {
          self.shubox.options.error(file, message);
        }
      },

      uploadProgress(file: any, progress: any, bytesSent: any) {
        self.shubox.element.dataset.shuboxProgress = String(progress);
        Dropzone.prototype.defaultOptions.uploadprogress!.apply(
          this,
          [file, progress, bytesSent],
        );
      },
    };

    return hash;
  }

  // Private

  public _updateFormValue(file: any, templateName: string) {
    const el = this.shubox.element as HTMLInputElement;
    let interpolatedText = "";
    let uploadingText = "";

    // If passed the transformName option, warn about its deprecation.
    if (this.shubox.options.transformName) {
      window.console!.warn(
        `DEPRECATION: The "transformName" option will be deprecated by version 1.2. Please update to "transforms", and see docs.`,
      );
    }
    // ... same with transformCallbacks.
    if (this.shubox.options.transformCallbacks) {
      window.console!.warn(
        `DEPRECATION: The "transformCallbacks" option will be deprecated by version 1.2. Please update to "transforms", and see docs.`,
      );
    }

    // If we're processing the successTemplate, and the user instead used
    // the deprecated "s3urlTemplate" option, then rename the template name
    // to use that one as the key.
    let effectiveTemplateName = templateName;
    if (templateName === "successTemplate" && this.shubox.options.s3urlTemplate) {
      window.console!.warn(
        `DEPRECATION: The "s3urlTemplate" will be deprecated by version 1.0. Please update to "successTemplate".`,
      );

      effectiveTemplateName = "s3urlTemplate";
    }

    const templateValue = effectiveTemplateName === "successTemplate"
      ? this.shubox.options.successTemplate
      : effectiveTemplateName === "s3urlTemplate"
        ? this.shubox.options.s3urlTemplate
        : undefined;

    if (templateValue) {
      interpolatedText = templateValue;
    }

    for (const key of this.replaceable) {
      interpolatedText = interpolatedText.replace(`{{${key}}}`, file[key]);
    }

    if (this.shubox.options.uploadingTemplate) {
      uploadingText = this.shubox.options.uploadingTemplate;

      for (const key of this.replaceable) {
        uploadingText = uploadingText.replace(`{{${key}}}`, file[key]);
      }
    }

    // Determine where to place the uploaded file; Replacing the
    // uploadingTemplate, at cursor, at the end, or replace the
    // whole field.
    if (
      (templateName === "successTemplate" || templateName === "s3urlTemplate")
      && !!this.shubox.options.uploadingTemplate
    ) {
      el.value = el.value.replace(uploadingText, interpolatedText);
      this._placeCursorAfterText(el, interpolatedText);

    } else if (this._insertableAtCursor(el)) {
      insertAtCursor(el, interpolatedText);
      this._placeCursorAfterText(el, interpolatedText);

    } else if (this._isAppendingText()) {
      el.value = el.value + interpolatedText;

    } else {
      el.value = interpolatedText;
    }
  }

  public _placeCursorAfterText(el: HTMLInputElement, text: string): void {
    let pos = el.value.indexOf(text);
    pos = pos + text.length;
    el.setSelectionRange(pos, pos);
    el.focus();
  }

  public _isFormElement(): boolean {
    return (["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) > -1);
  }

  public _isAppendingText(): boolean {
    return (this.shubox.options.textBehavior === "append");
  }

  public _insertableAtCursor(el: HTMLInputElement): boolean {
    return (
      el.tagName === "TEXTAREA" &&
      this.shubox.options.textBehavior === "insertAtCursor"
    );
  }
}
