import Shubox from "shubox";
import {filenameFromFile} from "./filename_from_file";
import {objectToFormData} from "./object_to_form_data";

export interface ShuboxFile extends Dropzone.DropzoneFile {
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
  file: ShuboxFile,
  extraParams: object,
  ): void {

  fetch(shubox.uploadUrl, {
    method: "POST",
    mode: "cors",
    body: objectToFormData({
      key: shubox.key,
      transformName: shubox.options.transformName,
      extraParams,
      bucket: "localhost-4100",

      file: {
        width: file.width,
        height: file.height,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: filenameFromFile(file),
        s3Path: file.s3,
        s3Url: file.s3url,
        size: file.size,
        type: file.type,
      },
    }),
  })
  .catch(function(err) {
    console.log(`There was a problem with your request: ${err.message}`);
  });
}
