import Shubox from "shubox";
import {filenameFromFile} from "./filename_from_file";
import {objectToFormData} from "./object_to_form_data";

export interface IShuboxFile extends Dropzone.DropzoneFile {
  width: number;
  height: number;
  lastModified: number;
  lastModifiedDate: any;
  s3: string;
  s3url: string;
  postData: object[];
}

export function uploadCompleteEvent(
  shubox: Shubox,
  file: IShuboxFile,
  extraParams: object,
  ): void {

  fetch(shubox.uploadUrl, {
    body: objectToFormData({
      bucket: "localhost-4100",
      extraParams,
      file: {
        height: file.height,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: filenameFromFile(file),
        s3Path: file.s3,
        s3Url: file.s3url,
        size: file.size,
        type: file.type,
        width: file.width,
      },
      key: shubox.key,
      transformName: shubox.options.transformName,
    }),
    method: "POST",
    mode: "cors",
  })
  .catch((err) => {
    console.log(`There was a problem with your request: ${err.message}`);
  });
}
