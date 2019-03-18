import Shubox from "shubox";

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  public toHash() {
    return {
      acceptedFiles: "image/*",
      addedfile(file) {},
      cdn: null,
      error(file, message) {},
      extraParams: {},
      previewsContainer: ["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      s3Key: null,
      sending(file, xhr, formData) {},
      success(file) {},
      successTemplate: "{{s3url}}",
      textBehavior: "replace",
      transformName: null,
      uploadingTemplate: "",
    };
  }
}
