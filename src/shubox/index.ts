import Dropzone from "dropzone";
import { ShuboxCallbacks } from "./shubox_callbacks";
import { ShuboxOptions as ShuboxOptionsClass } from "./shubox_options";
import { OfflineError } from "./errors";
import { version } from "../../package.json";
import type { ShuboxOptions, ShuboxCallbackMethods } from "./types";

export interface IUserOptions extends Partial<ShuboxOptions> {
  baseUrl?: string;
  signatureUrl?: string;
  uploadUrl?: string;
  uuid?: string;
  key?: string;
  timeout?: number;
  retryAttempts?: number;
}

export default class Shubox {
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

  constructor(selector: string = ".shubox", options: IUserOptions = {}) {
    this.selector = selector;
    this.element = document.createElement('div') as HTMLDivElement;

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

    this.init(options);
  }

  public init(options: Partial<ShuboxOptions>) {
    Dropzone.autoDiscover = false;
    const els = document.querySelectorAll(this.selector);

    for (const element of Array.from(els)) {
      this.element = element as HTMLElement;
      this.callbacks = new ShuboxCallbacks(this as Shubox, Shubox.instances).toHash();
      this.options = {
        ...this.options,
        ...(new ShuboxOptionsClass(this as Shubox).toHash()),
        ...options,
      } as ShuboxOptions;

      const dropzoneOptions: Dropzone.DropzoneOptions = {
        // callbacks that we need to delegate to. In some cases there's work
        // needing to be passed through to Shubox's handler, and sometimes
        // the Dropbox handler, _in addition to_ the callback the user provides.
        accept: this.callbacks.accept as any,
        acceptedFiles: this.options.acceptedFiles,
        addedfile: this.callbacks.addedfile as any,
        error: this.callbacks.error as any,
        previewsContainer: this.options.previewsContainer,
        sending: this.callbacks.sending as any,
        success: this.callbacks.success as any,
        uploadprogress: this.callbacks.uploadProgress as any,
        url: "http://localhost",
      };

      const dropzone = new Dropzone(this.element, {
        ...(this.options as any),
        ...dropzoneOptions,
      });

      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);
    }
  }

  public upload(file: Dropzone.DropzoneFile) {
    // Check if user is offline before attempting upload
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineError = new OfflineError("Cannot upload while offline. Please check your internet connection.");
      if (this.callbacks.error) {
        this.callbacks.error(file, offlineError);
      }
      return;
    }

    this.element.dropzone.addFile(file);
  }
}
