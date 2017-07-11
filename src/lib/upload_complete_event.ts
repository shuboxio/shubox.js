import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';

export function uploadCompleteEvent(file: Shubox.ShuboxFile, extraParams: object): void {
  fetch('http://localhost/api/upload/success', {
    method: 'post',
    mode: 'cors',
    body: objectToFormData({
      extraParams: extraParams,

      uploaded: {
        width:            file.width,
        height:           file.height,
        lastModified:     file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name:             filenameFromFile(file),
        s3Path:           file.s3,
        s3Url:            file.s3url,
        size:             file.size,
        type:             file.type
      }
    })
  }).catch(function(err) {
    console.log('There was a problem with your request:' + err.message);
  });
}
