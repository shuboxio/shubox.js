import Dropzone from "dropzone";
import { ShuboxCallbacks } from "./shubox_callbacks";
import { ShuboxOptions as ShuboxOptionsClass } from "./shubox_options";
import { OfflineError } from "./errors";
import { version } from "../../package.json";
import type { ShuboxOptions, ShuboxCallbackMethods } from "./types";
import { ShuboxApiClient } from "~/shubox/api/client";
import { ShuboxDomRenderer } from "~/shubox/dom/renderer";
import { S3SignatureHandler } from "~/shubox/handlers/signature";
import { S3UploadHandler } from "~/shubox/handlers/upload";
import { SuccessHandler } from "~/shubox/handlers/success";

export interface IUserOptions extends Partial<ShuboxOptions> {
  baseUrl?: string;
  signatureUrl?: string;
  uploadUrl?: string;
  uuid?: string;
  key?: string;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * Main Shubox class for direct browser-to-S3 file uploads.
 * Wraps Dropzone.js and integrates with the Shubox service for S3 signatures
 * and image/video transformations.
 *
 * @example
 * ```typescript
 * new Shubox('.upload-area', {
 *   key: 'your-shubox-key',
 *   success: (file) => console.log('Uploaded:', file.s3url),
 *   transforms: {
 *     '200x200#': (file) => console.log('Thumbnail:', file.transform.s3url)
 *   }
 * })
 * ```
 */
export default class Shubox {
  /** Array of all Dropzone instances created by Shubox */
  public static instances: Dropzone[] = [];

  public baseUrl: string = "https://api.shubox.io";
  public signatureUrl: string = `${this.baseUrl}/signatures`;
  public uploadUrl: string = `${this.baseUrl}/uploads`;
  public key: string = "";
  public selector: string;
  public element: HTMLElement | HTMLInputElement;
  public options: ShuboxOptions = {} as ShuboxOptions;
  public callbacks: ShuboxCallbackMethods = {} as ShuboxCallbackMethods;
  public version: string = version;
  private offlineCheckEnabled: boolean = true;
  private dropzoneInstances: Dropzone[] = [];
  private apiClient!: ShuboxApiClient;
  private renderer!: ShuboxDomRenderer;

  /**
   * Creates a new Shubox instance and initializes Dropzone on matching elements.
   * @param selector - CSS selector for elements to enable file upload (default: ".shubox")
   * @param options - Configuration options including key, callbacks, and Dropzone settings
   */
  constructor(selector: string = ".shubox", options: IUserOptions = {}) {
    this.selector = selector;
    this.element = document.createElement('div') as HTMLDivElement;

    // Configure offline check (default: true)
    this.offlineCheckEnabled = options.offlineCheck !== false;

    if (options.baseUrl) {
      this.baseUrl = options.baseUrl;
      this.signatureUrl = `${this.baseUrl}/signatures`;
      this.uploadUrl = `${this.baseUrl}/uploads`;
      delete options.baseUrl;
    }

    if (options.signatureUrl) {
      this.signatureUrl = options.signatureUrl;
      delete options.signatureUrl;
    }

    if (options.uploadUrl) {
      this.uploadUrl = options.uploadUrl;
      delete options.uploadUrl;
    }

    if (options.uuid) {
      this.key = options.uuid;
      delete options.uuid;
    }

    if (options.key) {
      this.key = options.key;
      delete options.key;
    }

    // Create core services with dependency injection
    this.apiClient = new ShuboxApiClient({
      key: this.key,
      baseUrl: this.baseUrl,
      signatureUrl: this.signatureUrl,
      uploadUrl: this.uploadUrl
    });

    this.renderer = new ShuboxDomRenderer();

    this.init(options);
    this._setupOfflineDetection();
  }

  /**
   * Initializes Dropzone instances on all elements matching the selector.
   * Creates handler instances with dependency injection and configures callbacks.
   * @param options - Shubox configuration options to merge with defaults
   */
  public init(options: Partial<ShuboxOptions>) {
    Dropzone.autoDiscover = false;
    const els = document.querySelectorAll(this.selector);

    for (const element of Array.from(els)) {
      this.element = element as HTMLElement;

      // Get default options from ShuboxOptionsClass
      this.options = {
        ...this.options,
        ...(new ShuboxOptionsClass(this as Shubox).toHash()),
        ...options,
      } as ShuboxOptions;

      // Create handlers with dependency injection
      const signatureHandler = new S3SignatureHandler(this.apiClient, {
        key: this.key,
        s3Key: this.options.s3Key || undefined,
        extraParams: this.options.extraParams
      });

      const uploadHandler = new S3UploadHandler({
        extraParams: this.options.extraParams
      });

      const successHandler = new SuccessHandler(this.renderer, this.apiClient, {
        successTemplate: this.options.successTemplate || '{{s3url}}',
        textBehavior: (this.options.textBehavior || 'replace') as 'replace' | 'append' | 'insertAtCursor',
        transforms: (this.options.transforms || {}) as any,
        success: this.options.success as any
      });

      // Create callbacks with handlers
      const shuboxCallbacks = new ShuboxCallbacks(
        signatureHandler,
        uploadHandler,
        successHandler,
        {
          addedfile: this.options.addedfile as any,
          error: this.options.error as any,
          uploadingTemplate: this.options.uploadingTemplate
        }
      );

      const dropzoneOptions: Dropzone.DropzoneOptions = {
        // callbacks that we need to delegate to. In some cases there's work
        // needing to be passed through to Shubox's handler, and sometimes
        // the Dropbox handler, _in addition to_ the callback the user provides.
        accept: shuboxCallbacks.accept as any,
        acceptedFiles: this.options.acceptedFiles,
        addedfile: shuboxCallbacks.addedfile as any,
        error: shuboxCallbacks.error as any,
        previewsContainer: this.options.previewsContainer,
        sending: shuboxCallbacks.sending as any,
        success: shuboxCallbacks.success as any,
        url: "http://localhost",
        // Set timeout for XHR requests (default: 60 seconds for uploads)
        timeout: this.options.timeout || 60000,
      };

      const dropzone = new Dropzone(this.element, {
        ...(this.options as any),
        ...dropzoneOptions,
      });

      // Set the dropzone instance in callbacks so they can call Dropzone defaults with correct context
      shuboxCallbacks.setDropzoneInstance(dropzone);

      // Track instances for this Shubox instance
      this.dropzoneInstances.push(dropzone);

      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);

      // Apply offline state if currently offline
      if (this.offlineCheckEnabled && this._isOffline()) {
        this._disableDropzone(dropzone);
      }
    }
  }

  /**
   * Programmatically uploads a file using the configured Shubox instance.
   * Checks for offline status before attempting upload.
   * @param file - Dropzone file object to upload
   */
  public upload(file: Dropzone.DropzoneFile) {
    // Check if user is offline before attempting upload
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineError = new OfflineError("Cannot upload while offline. Please check your internet connection.");
      if (this.callbacks.error) {
        this.callbacks.error(file as any, offlineError);
      }
      return;
    }

    this.element.dropzone.addFile(file);
  }

  /**
   * Set up online/offline event listeners
   * @private
   */
  private _setupOfflineDetection(): void {
    if (!this.offlineCheckEnabled || typeof window === 'undefined') {
      return;
    }

    // Handle going offline
    window.addEventListener('offline', () => {
      this.dropzoneInstances.forEach(dropzone => {
        this._disableDropzone(dropzone);
      });
    });

    // Handle coming back online
    window.addEventListener('online', () => {
      this.dropzoneInstances.forEach(dropzone => {
        this._enableDropzone(dropzone);
      });
    });
  }

  /**
   * Check if browser is currently offline
   * @private
   */
  private _isOffline(): boolean {
    return typeof navigator !== 'undefined' && !navigator.onLine;
  }

  /**
   * Disable a Dropzone instance (prevent file selection)
   * @private
   */
  private _disableDropzone(dropzone: Dropzone): void {
    dropzone.disable();
    const element = dropzone.element as HTMLElement;
    element.classList.add('shubox-offline');
    element.setAttribute('data-shubox-offline', 'true');
  }

  /**
   * Enable a Dropzone instance (allow file selection)
   * @private
   */
  private _enableDropzone(dropzone: Dropzone): void {
    dropzone.enable();
    const element = dropzone.element as HTMLElement;
    element.classList.remove('shubox-offline');
    element.removeAttribute('data-shubox-offline');
  }
}
