import Dropzone from "dropzone";
import {ShuboxCallbacks} from "./src/shubox_callbacks";
import {ShuboxOptions} from "./src/shubox_options";

export default class Shubox {
  public static instances: Dropzone[] = [];
  public signatureUrl: string = "https://api.shubox.io/signatures";
  public uploadUrl: string = "https://api.shubox.io/uploads";
  public key: string = "";
  public selector: string;
  public element: HTMLElement | HTMLInputElement;
  public options: any = {};
  public callbacks: any = {};

  constructor(selector: string = ".shubox", options: object = {}) {
    this.selector = selector;

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

    for (let i = 0; i < els.length; i++) {
      this.element = els[i] as HTMLElement;
      this.callbacks = new ShuboxCallbacks(this).toHash();
      this.options = {
        ...this.options,
        ...(new ShuboxOptions(this).toHash()),
        ...options,
      };

      const dzOptions = {
        url: "http://localhost",
        previewsContainer: this.options.previewsContainer,
        acceptedFiles: this.options.acceptedFiles,

        // callbacks that we need to delegate to. In some cases there's work
        // needing to be passed through to Shubox's handler, and sometimes
        // the Dropbox handler, _in addition to_ the callback the user provides.
        accept: this.callbacks.accept,
        addedfile: this.callbacks.addedfile,
        sending: this.callbacks.sending,
        success: this.callbacks.success,
        error: this.callbacks.error,
        uploadprogress: this.callbacks.uploadProgress,
      };
      const dropzone = new Dropzone(this.element, { ...options, ...dzOptions });
      this.element.addEventListener("paste", ShuboxCallbacks.pasteCallback(dropzone));
      Shubox.instances.push(dropzone);
    }
  }
}
