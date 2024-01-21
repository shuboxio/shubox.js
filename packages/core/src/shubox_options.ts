import Shubox from "@shubox/core";

export class ShuboxOptions {
    public shubox: Shubox;

    constructor(shubox: Shubox) {
        this.shubox = shubox;
    }

    public toHash() {
        return {
            acceptedFiles: "image/*",
            addedfile(file: any) { },
            cdn: null,
            error(file: any, message: String) { },
            extraParams: {},
            previewsContainer: ["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
            s3Key: null,
            sending(file: any, xhr: any, formData: any) { },
            success(file: any) { },
            successTemplate: "{{s3url}}",
            textBehavior: "replace",
            transformName: null,
            uploadingTemplate: "",
            webcam: null,
        };
    }
}
