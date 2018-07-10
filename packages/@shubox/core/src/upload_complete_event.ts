import {objectToFormData} from './object_to_form_data';
import {filenameFromFile} from './filename_from_file';

export interface ShuboxFile extends Dropzone.DropzoneFile {
  width: number;
  height: number;
  lastModified: number;
  s3: string;
  s3url: string;
  postData: object[];
}

export function uploadCompleteEvent(file: ShuboxFile, extraParams: object,): void {
  fetch('https://localhost:4101/uploads', {
    method: 'post',
    mode: 'cors',
    body: objectToFormData({
      extraParams: extraParams,
      bucket: 'localhost-4100',

      uploaded: {
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
  }).catch(function(err) {
    console.log('There was a problem with your request:' + err.message);
  });
}
