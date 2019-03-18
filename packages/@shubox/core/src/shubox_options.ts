import Shubox from "shubox";

export class ShuboxOptions {
  public shubox: Shubox;

  constructor(shubox: Shubox) {
    this.shubox = shubox;
  }

  public toHash() {
    return {
      cdn: null,
      addedfile(file) {},
      error(file, message) {},
      sending(file, xhr, formData) {},
      success(file) {},
      textBehavior: "replace",
      successTemplate: "{{s3url}}",
      uploadingTemplate: "",
      acceptedFiles: "image/*",
      s3Key: null,
      previewsContainer: ["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
      transformName: null,
      extraParams: {},
    };
  }
}
