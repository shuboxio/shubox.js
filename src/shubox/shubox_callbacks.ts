import Dropzone from "dropzone";
import Shubox from "./index";
import type { ShuboxDropzoneFile, IShuboxFile } from "./types";
import { dispatchShuboxEvent } from "./events";
import { uploadCompleteEvent } from "./upload_complete_event";
import { TransformCallback } from "./transform_callback";
import { insertAtCursor } from "./insert_at_cursor";
import { ShuboxConfig } from "./config";
import { ShuboxDomRenderer } from "./dom_renderer";
import { ShuboxApiClient } from "./api_client";
import { ShuboxErrorHandler } from "./error_handler";
import { ShuboxResourceManager } from "./resource_manager";
import { ShuboxTransformManager } from "./transform_manager";
import {
  OfflineError,
  NetworkError,
  TimeoutError,
  UploadError,
} from "./errors";

export interface IShuboxDefaultOptions {
  success?: (file: Dropzone.DropzoneFile) => void;
  error?: (file: Dropzone.DropzoneFile, message: string) => void;
  sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: any) => void;
  addedfile?: (file: Dropzone.DropzoneFile) => void;
  textBehavior?: string;
  s3urlTemplate?: string;
  successTemplate?: string;
  uploadingTemplate?: string;
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
  public readonly replaceable: string[];
  private domRenderer: ShuboxDomRenderer;
  private apiClient: ShuboxApiClient;
  private errorHandler: ShuboxErrorHandler;
  private resourceManager: ShuboxResourceManager;
  private transformManager: ShuboxTransformManager;

  constructor(shubox: Shubox, instances: Dropzone[]) {
    this.shubox = shubox;
    this.instances = instances;
    this.replaceable = ShuboxConfig.REPLACEABLE_VARIABLES;
    this.domRenderer = new ShuboxDomRenderer(shubox.element);
    this.apiClient = new ShuboxApiClient(shubox);
    this.errorHandler = new ShuboxErrorHandler(shubox.element);
    this.resourceManager = new ShuboxResourceManager(shubox.element);
    this.transformManager = new ShuboxTransformManager();
  }

  public toHash() {
    // assigning `this` (instance of ShuboxCallbacks) to `self` so that `this`
    // inside the body of these callback functions are reserved for the
    // instance of Dropzone that invokes the function.
    const self = this;

    const hash = {
      async accept(file: ShuboxDropzoneFile, done: (error?: string | Error) => void) {
        // Check offline state
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          const offlineError = new OfflineError(
            'You are offline. Uploads will resume when back online.'
          );
          self.shubox.callbacks.error(file, offlineError);
          return;
        }

        try {
          // Use ShuboxApiClient for signature fetching
          const signature = await self.apiClient.fetchSignature(
            {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            {
              s3Key: self.shubox.options.s3Key || undefined,
              retryAttempts: self.shubox.options.retryAttempts,
              timeout: self.shubox.options.timeout,
            }
          );

          if ((signature as any).error) {
            self.shubox.callbacks.error(file, (signature as any).error);
            return;
          }

          // Update Dropzone URLs with signature
          self.instances.forEach((dz) => {
            dz.options.url = signature.aws_endpoint;
          });

          // Attach signature to file
          file.postData = signature;
          file.s3 = signature.key;

          done();
        } catch (err) {
          self.shubox.callbacks.error(file, err as Error);
        }
      },

      sending(file: ShuboxDropzoneFile, xhr: XMLHttpRequest, formData: FormData) {
        self.shubox.element.classList.add("shubox-uploading");

        // Update the form value if it is able
        if (self._isFormElement()) {
          self._updateFormValue(file, "uploadingTemplate");
        }

        const keys = Object.keys(file.postData);
        keys.forEach((key) => {
          const val = file.postData[key];
          if (val !== undefined) {
            formData.append(key, val);
          }
        });

        // Run user's provided sending callback
        if (self.shubox.options.sending) {
          self.shubox.options.sending(file, xhr, formData);
        }
      },

      addedfile(file: ShuboxDropzoneFile) {
        if (!self.shubox.options.acceptedFiles) {
          self.shubox.options.acceptedFiles = ShuboxConfig.DEFAULT_ACCEPTED_FILES;
        }

        // Call Dropzone default
        Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);

        if (self.shubox.options.addedfile) {
          self.shubox.options.addedfile(file);
        }
      },

      success(file: ShuboxDropzoneFile, response: string) {
        // Check for recovery from previous failures
        const hadPreviousFailures =
          file._shuboxRetryCount && file._shuboxRetryCount > 0;
        if (hadPreviousFailures) {
          self.errorHandler.dispatchRecoveredEvent(file, file._shuboxRetryCount! + 1);
        }

        // Update DOM
        self.domRenderer.setSuccessState();

        // Parse S3 URL from XML response
        const match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        file.s3url = match[1].replace(/%2F/g, '/').replace(/%2B/g, '%20');

        // Apply CDN URL if configured
        if (self.shubox.options.cdn) {
          const path = file.s3url.split('/').slice(4).join('/');
          file.s3url = `${self.shubox.options.cdn}/${path}`;
        }

        // Send upload complete notification
        let apiVersion = 1.0;
        uploadCompleteEvent(self.shubox, file as IShuboxFile, self.shubox.options.extraParams || {})
          .then((response) => {
            if (!response) return;

            apiVersion = Number(response.headers.get("X-Shubox-API"));

            // Handle transforms
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
                new TransformCallback(
                  file as IShuboxFile,
                  variant,
                  callback,
                  apiVersion,
                  doVariantCharacterTranslation,
                  self.shubox.callbacks.error
                ).run();
              }
            }

            // Update form value if applicable
            if (self._isFormElement()) {
              self._updateFormValue(file, 'successTemplate');
            }

            // Call user success callback
            if (self.shubox.options.success) {
              self.shubox.options.success(file);
            }
          })
          .catch((err) => {
            console.error('Error in upload complete event:', err);
          });

        // Call Dropzone default
        Dropzone.prototype.defaultOptions.success!.apply(this, [file]);
      },

      error(file: ShuboxDropzoneFile, message: string | Error, xhr?: XMLHttpRequest) {
        const error = message instanceof Error ? message : new Error(String(message));

        // Initialize retry count
        if (file._shuboxRetryCount === undefined) {
          file._shuboxRetryCount = 0;
        }

        // Determine if recoverable
        const isRecoverable = self.errorHandler.isRecoverableError(error);
        const maxRetries = self.shubox.options.retryAttempts || 3;
        const shouldRetry = isRecoverable && file._shuboxRetryCount < maxRetries;

        // Dispatch error-specific events
        if (error instanceof TimeoutError) {
          self.errorHandler.dispatchTimeoutEvent(file, self.shubox.options.timeout || 60000);
        }

        // Handle retry
        if (shouldRetry) {
          file._shuboxRetryCount++;

          // Dispatch retry:start event on first retry
          if (file._shuboxRetryCount === 1) {
            self.errorHandler.dispatchRetryStartEvent(error, file, maxRetries);
          }

          const delay = self.errorHandler.calculateBackoffDelay(file._shuboxRetryCount);
          self.errorHandler.dispatchRetryEvent(file._shuboxRetryCount, delay, error, file, maxRetries);

          // Call onRetry callback if provided
          if (self.shubox.options.onRetry) {
            self.shubox.options.onRetry(file._shuboxRetryCount, error, file);
          }

          file.status = Dropzone.QUEUED;
          self.domRenderer.clearErrorState();

          file._shuboxRetryTimeout = setTimeout(() => {
            const dropzone = self.instances.find((dz) =>
              Array.from(dz.files).some((f: any) => f === file)
            );
            if (dropzone) {
              dropzone.processFile(file);
            }
          }, delay);

          return;
        }

        // Handle final error
        self.domRenderer.clearSuccessState();
        self.domRenderer.setErrorState();
        self.errorHandler.dispatchErrorEvent(error, file);

        const messageStr = typeof message === 'string' ? message : message.message;
        if (messageStr.includes("Referring domain not permitted") && window.location.hostname === "localhost") {
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

        // Call Dropzone default + user callback
        const xhrParam = xhr || new XMLHttpRequest();
        Dropzone.prototype.defaultOptions.error!.apply(this, [
          file,
          message,
          xhrParam,
        ]);
        if (self.shubox.options.error) {
          self.shubox.options.error(file, message);
        }
      },

      uploadProgress(file: ShuboxDropzoneFile, progress: number, bytesSent: number) {
        self.domRenderer.setProgress(progress);

        // Call Dropzone default
        Dropzone.prototype.defaultOptions.uploadprogress!.apply(this, [
          file,
          progress,
          bytesSent,
        ]);
      },

      canceled(file: ShuboxDropzoneFile) {
        self.resourceManager.onFileCanceled(file);

        // Call user's canceled callback if provided
        if (self.shubox.options.canceled) {
          self.shubox.options.canceled(file);
        }
      },

      removedfile(file: ShuboxDropzoneFile) {
        self.resourceManager.onFileRemoved(file);

        // Call Dropzone default
        Dropzone.prototype.defaultOptions.removedfile!.apply(this, [file]);

        // Call user's removedfile callback if provided
        if (self.shubox.options.removedfile) {
          self.shubox.options.removedfile(file);
        }
      },

      queuecomplete() {
        self.resourceManager.onQueueComplete();
        self.domRenderer.clearProgress();

        // Call Dropzone default
        Dropzone.prototype.defaultOptions.queuecomplete!.apply(this, []);

        // Call user's queuecomplete callback if provided
        if (self.shubox.options.queuecomplete) {
          self.shubox.options.queuecomplete();
        }
      },
    };

    return hash;
  }

  // Private

  public _updateFormValue(file: ShuboxDropzoneFile, templateName: string) {
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
        : effectiveTemplateName === "uploadingTemplate"
          ? this.shubox.options.uploadingTemplate
          : undefined;

    if (templateValue) {
      interpolatedText = templateValue;
    }

    for (const key of this.replaceable) {
      const value = (file as any)[key];
      interpolatedText = interpolatedText.replace(`{{${key}}}`, value);
    }

    if (this.shubox.options.uploadingTemplate) {
      uploadingText = this.shubox.options.uploadingTemplate;

      for (const key of this.replaceable) {
        const value = (file as any)[key];
        uploadingText = uploadingText.replace(`{{${key}}}`, value);
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
      this.domRenderer.placeCursorAfterText(el, interpolatedText);

    } else if (this._insertableAtCursor(el)) {
      insertAtCursor(el, interpolatedText);
      this.domRenderer.placeCursorAfterText(el, interpolatedText);

    } else if (this._isAppendingText()) {
      el.value = el.value + interpolatedText;

    } else {
      el.value = interpolatedText;
    }
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
