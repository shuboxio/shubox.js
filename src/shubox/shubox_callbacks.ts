import Dropzone from "dropzone";
import type { Shubox } from "./index";
import type { ShuboxDropzoneFile, IShuboxFile } from "./types";
import { dispatchShuboxEvent } from "./events";
import { uploadCompleteEvent } from "./upload_complete_event";
import { TransformCallback } from "./transform_callback";
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
        // Check if user is offline before attempting to fetch signature
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          const offlineError = new OfflineError("Cannot upload while offline. Please check your internet connection.");
          self.shubox.callbacks.error(file, offlineError);
          return;
        }

        try {
          const response = await fetchWithRetry(
            self.shubox.signatureUrl,
            {
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
            },
            {
              retryAttempts: self.shubox.options.retryAttempts || 3,
              timeout: self.shubox.options.timeout || 30000,
            }
          );

          const json = await parseJsonResponse<SignatureResponse>(response);

          if (json.error) {
            self.shubox.callbacks.error(file, json.error);
          } else {
            self.instances.forEach((dz) => {
              // Dropzone instances allow setting url at runtime
              dz.options.url = json.aws_endpoint;
            });

            file.postData = json;
            file.s3 = json.key;
            done();
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          self.shubox.callbacks.error(file, error);
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
        Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);
        if (self.shubox.options.addedfile) {
          self.shubox.options.addedfile(file);
        }
      },

      success(file: ShuboxDropzoneFile, response: string) {
        // Check if this is a recovery from previous failures
        const hadPreviousFailures = file._shuboxRetryCount && file._shuboxRetryCount > 0;

        if (hadPreviousFailures) {
          // Dispatch recovered event
          dispatchShuboxEvent(self.shubox.element, 'shubox:recovered', {
            file,
            attemptCount: file._shuboxRetryCount! + 1, // +1 because the first attempt is not counted
          });
        }

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

        uploadCompleteEvent(self.shubox, file as IShuboxFile, (self.shubox.options.extraParams || {})).then(response => {
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

          // If supplied, run the options callback
          if (self.shubox.options.success) {
            self.shubox.options.success(file);
          }
        });
      },

      error(file: ShuboxDropzoneFile, message: string | Error) {
        // Initialize retry count if not set
        if (file._shuboxRetryCount === undefined) {
          file._shuboxRetryCount = 0;
        }

        // Determine if this error is recoverable and should be retried
        const error = message instanceof Error ? message : new Error(String(message));
        const isRecoverable = self._isRecoverableUploadError(error);
        const maxRetries = self.shubox.options.retryAttempts || 3;
        const shouldRetry = isRecoverable && file._shuboxRetryCount < maxRetries;

        // Dispatch timeout event if this is a timeout error
        if (error instanceof TimeoutError) {
          dispatchShuboxEvent(self.shubox.element, 'shubox:timeout', {
            file,
            timeout: self.shubox.options.timeout || 60000,
          });
        }

        if (shouldRetry) {
          file._shuboxRetryCount++;

          // Dispatch retry:start event on first retry
          if (file._shuboxRetryCount === 1) {
            dispatchShuboxEvent(self.shubox.element, 'shubox:retry:start', {
              error,
              file,
              maxRetries,
            });
          }

          // Calculate exponential backoff delay
          const delay = Math.pow(2, file._shuboxRetryCount - 1) * 1000; // 1s, 2s, 4s

          // Dispatch retry:attempt event
          dispatchShuboxEvent(self.shubox.element, 'shubox:retry:attempt', {
            error,
            file,
            attempt: file._shuboxRetryCount,
            maxRetries,
            delay,
          });

          // Call onRetry callback if provided
          if (self.shubox.options.onRetry) {
            self.shubox.options.onRetry(file._shuboxRetryCount, error, file);
          }

          // Reset file status to queued to allow retry
          file.status = Dropzone.QUEUED;

          // Remove error styling temporarily
          self.shubox.element.classList.remove("shubox-error");

          // Schedule retry after delay and store timeout ID for cleanup
          file._shuboxRetryTimeout = setTimeout(() => {
            // Find the dropzone instance that owns this file
            const dropzone = self.instances.find(dz => {
              return Array.from(dz.files).some(f => f === file);
            });

            if (dropzone) {
              dropzone.processFile(file);
            }
          }, delay);

          return; // Don't call error handler yet, we're retrying
        }

        // If we've exhausted retries or error is not recoverable, handle the error
        self.shubox.element.classList.remove("shubox-uploading");
        self.shubox.element.classList.add("shubox-error");

        // Dispatch error event
        dispatchShuboxEvent(self.shubox.element, 'shubox:error', {
          error,
          file,
        });

        const xhr = new XMLHttpRequest(); // bc type signature
        Dropzone.prototype.defaultOptions.error!.apply(this, [file, message, xhr]);

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

        if (self.shubox.options.error) {
          self.shubox.options.error(file, message);
        }
      },

      uploadProgress(file: ShuboxDropzoneFile, progress: number, bytesSent: number) {
        self.shubox.element.dataset.shuboxProgress = String(progress);
        Dropzone.prototype.defaultOptions.uploadprogress!.apply(
          this,
          [file, progress, bytesSent],
        );
      },

      canceled(file: ShuboxDropzoneFile) {
        // Clean up resources when upload is canceled
        self._cleanupFile(file);

        // Call user's canceled callback if provided
        if (self.shubox.options.canceled) {
          self.shubox.options.canceled(file);
        }
      },

      removedfile(file: ShuboxDropzoneFile) {
        // Clean up resources when file is removed
        self._cleanupFile(file);

        // Call Dropzone's default removedfile to handle DOM cleanup
        if (Dropzone.prototype.defaultOptions.removedfile) {
          Dropzone.prototype.defaultOptions.removedfile!.apply(this, [file]);
        }

        // Call user's removedfile callback if provided
        if (self.shubox.options.removedfile) {
          self.shubox.options.removedfile(file);
        }
      },

      queuecomplete() {
        // Remove uploading class when queue is complete
        self.shubox.element.classList.remove("shubox-uploading");

        // Call user's queuecomplete callback if provided
        if (self.shubox.options.queuecomplete) {
          self.shubox.options.queuecomplete();
        }
      },
    };

    return hash;
  }

  /**
   * Clean up resources associated with a file
   * @param file - The file to clean up
   */
  private _cleanupFile(file: ShuboxDropzoneFile): void {
    // Reset retry count
    if (file._shuboxRetryCount !== undefined) {
      delete file._shuboxRetryCount;
    }

    // Clean up any pending retry timeouts
    if (file._shuboxRetryTimeout !== undefined) {
      clearTimeout(file._shuboxRetryTimeout);
      delete file._shuboxRetryTimeout;
    }

    // Remove upload-related CSS classes
    this.shubox.element.classList.remove("shubox-uploading");
    this.shubox.element.classList.remove("shubox-error");

    // Remove progress data attribute
    delete this.shubox.element.dataset.shuboxProgress;
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

  /**
   * Determines if an upload error is recoverable and should be retried
   * @param error - The error that occurred
   * @returns true if the error is recoverable and should be retried
   */
  public _isRecoverableUploadError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();

    // Network errors are recoverable
    if (error instanceof NetworkError) {
      return true;
    }

    // Timeout errors are recoverable (they might succeed on retry)
    if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
      return true;
    }

    // Connection errors are recoverable
    if (errorMessage.includes("network") ||
        errorMessage.includes("connection") ||
        errorMessage.includes("fetch")) {
      return true;
    }

    // 5xx server errors are recoverable (server might recover)
    if (error instanceof UploadError && error.statusCode && error.statusCode >= 500) {
      return true;
    }

    // HTTP 5xx errors in message
    if (errorMessage.match(/http 5\d{2}/)) {
      return true;
    }

    // 429 rate limit errors are recoverable
    if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      return true;
    }

    // Service unavailable, bad gateway, gateway timeout
    if (errorMessage.includes("503") ||
        errorMessage.includes("502") ||
        errorMessage.includes("504") ||
        errorMessage.includes("service unavailable") ||
        errorMessage.includes("bad gateway") ||
        errorMessage.includes("gateway timeout")) {
      return true;
    }

    // All other errors (4xx, validation errors, etc.) are not recoverable
    return false;
  }
}
