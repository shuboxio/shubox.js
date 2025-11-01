import Shubox from "./index";
import type { ShuboxDropzoneFile } from "./types";
import { DROPZONE_CONSTANTS } from "./config/constants";
import { SHUBOX_DEFAULTS } from "./config/defaults";

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  public toHash() {
    return {
      acceptedFiles: DROPZONE_CONSTANTS.DEFAULT_ACCEPTED_FILES,
      addedfile(file: ShuboxDropzoneFile) { },
      cdn: null,
      error(file: ShuboxDropzoneFile, message: string | Error) { },
      extraParams: SHUBOX_DEFAULTS.extraParams,
      previewsContainer: ["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) >= 0 ? false : SHUBOX_DEFAULTS.previewsContainer,
      s3Key: null,
      sending(file: ShuboxDropzoneFile, xhr: XMLHttpRequest, formData: FormData) { },
      success(file: ShuboxDropzoneFile) { },
      successTemplate: SHUBOX_DEFAULTS.successTemplate,
      textBehavior: SHUBOX_DEFAULTS.textBehavior,
      transformName: null,
      transforms: SHUBOX_DEFAULTS.transforms,
      uploadingTemplate: SHUBOX_DEFAULTS.uploadingTemplate,
    };
  }
}
