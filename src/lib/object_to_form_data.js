"use strict";
exports.__esModule = true;
function objectToFormData(obj, form, namespace) {
    var formData = form || new window.FormData();
    var formKey;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + '[' + property + ']';
            }
            else {
                formKey = property;
            }
            // if the property is an object/hash, and not a File,
            if (typeof obj[property] === 'object' &&
                !(obj[property] instanceof window.File)) {
                objectToFormData(obj[property], formData, property);
            }
            else {
                formData.append(formKey, obj[property]);
            }
        }
    }
    return formData;
}
exports.objectToFormData = objectToFormData;
