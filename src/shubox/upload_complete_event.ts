import Shubox from "./index";
import { filenameFromFile } from "./filename_from_file";
import { objectToFormData } from "./object_to_form_data";

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
): Promise<void | Response> {

  return fetch(shubox.uploadUrl, {
    headers: { "X-Shubox-Client": shubox.version },
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
      transforms: shubox.options.transforms,
    }),
    method: "POST",
    mode: "cors",
  })
    .catch((err) => {
      console.log(`There was a problem with your request: ${err.message}`);
    });
}
