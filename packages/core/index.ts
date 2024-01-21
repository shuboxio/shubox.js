import Dropzone from "dropzone";
import { ShuboxCallbacks } from "./src/shubox_callbacks";
import { ShuboxOptions } from "./src/shubox_options";
import { IWebcamOptions, Webcam } from "./src/webcam";

export interface IUserOptions {
  signatureUrl?: string;
  uploadUrl?: string;
  uuid?: string;
  key?: string;
  webcam?: "photo" | "video" | IWebcamOptions;
}

export default class Shubox {
  public static instances: Dropzone[] = [];

  public static stopCamera: () => void = Webcam.stopCamera;
  public signatureUrl: string = "https://api.shubox.io/signatures";
  public uploadUrl: string = "https://api.shubox.io/uploads";
  public key: string = "";
  public selector: string;
  public element: HTMLElement | HTMLInputElement;
  public options: any = {};
  public callbacks: any = {};
  public webcam?: Webcam;

  constructor(selector: string = ".shubox", options: IUserOptions = {}) {
    this.selector = selector;
    this.element = new HTMLElement;

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

      if (this.options.webcam) {
        this.options.clickable = false;
        this.options.acceptedFiles = "video/webm,video/mp4,image/png";
      }

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

      if (this.options.webcam) {
        this.webcam = new Webcam(dropzone, this.element, this.options.webcam);
      }

      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);
    }
  }

  public upload(file: Dropzone.DropzoneFile) {
    this.element.dropzone.addFile(file);
  }
}
