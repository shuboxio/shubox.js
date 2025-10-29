import Dropzone from "dropzone";
import { ShuboxCallbacks } from "./shubox_callbacks";
import { ShuboxOptions } from "./shubox_options";
import { version } from "../../package.json";

export interface IUserOptions {
  baseUrl?: string;
  signatureUrl?: string;
  uploadUrl?: string;
  uuid?: string;
  key?: string;
}

export default class Shubox {
  public static instances: Dropzone[] = [];

  public baseUrl: string = "https://api.shubox.io";
  public signatureUrl: string = `${this.baseUrl}/signatures`;
  public uploadUrl: string = `${this.baseUrl}/uploads`;
  public key: string = "";
  public selector: string;
  public element: HTMLElement | HTMLInputElement;
  public options: any = {};
  public callbacks: any = {};
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

  public init(options: object) {
    Dropzone.autoDiscover = false;
    const els = document.querySelectorAll(this.selector);

    for (const element of Array.from(els)) {
      this.element = element as HTMLElement;
      this.callbacks = new ShuboxCallbacks(this as Shubox, Shubox.instances).toHash();
      this.options = {
        ...this.options,
        ...(new ShuboxOptions(this as Shubox).toHash()),
        ...options,
      };

      const dropzoneOptions = {
        // callbacks that we need to delegate to. In some cases there's work
        // needing to be passed through to Shubox's handler, and sometimes
        // the Dropbox handler, _in addition to_ the callback the user provides.
        accept: this.callbacks.accept,
        acceptedFiles: this.options.acceptedFiles,
        addedfile: this.callbacks.addedfile,
        error: this.callbacks.error,
        previewsContainer: this.options.previewsContainer,
        sending: this.callbacks.sending,
        success: this.callbacks.success,
        uploadprogress: this.callbacks.uploadProgress,
        url: "http://localhost",
      };

      const dropzone = new Dropzone(this.element, {
        ...this.options,
        ...dropzoneOptions,
      });

      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);
    }
  }

  public upload(file: Dropzone.DropzoneFile) {
    this.element.dropzone.addFile(file);
  }
}
