"use strict";
exports.__esModule = true;
var object_to_form_data_1 = require("./object_to_form_data");
var filename_from_file_1 = require("./filename_from_file");
function uploadCompleteEvent(file, extraParams) {
    fetch('https://localhost:4101/uploads', {
        method: 'post',
        mode: 'cors',
        body: object_to_form_data_1.objectToFormData({
            extraParams: extraParams,
            bucket: 'localhost-4100',
            uploaded: {
                width: file.width,
                height: file.height,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: filename_from_file_1.filenameFromFile(file),
                s3Path: file.s3,
                s3Url: file.s3url,
                size: file.size,
                type: file.type
            }
        })
    })["catch"](function (err) {
        console.log('There was a problem with your request:' + err.message);
    });
}
exports.uploadCompleteEvent = uploadCompleteEvent;
