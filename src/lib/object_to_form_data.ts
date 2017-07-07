export function objectToFormData(obj: object, form?: null | FormData, namespace?: null | string) {
  var formData = form || new (<any>window).FormData();
  var formKey;

  for(var property in obj) {
    if(obj.hasOwnProperty(property)) {

      if(namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object/hash, and not a File,
      if(typeof obj[property] === 'object' && !(obj[property] instanceof (<any>window).File)) {
        objectToFormData(obj[property], formData, property);

      } else {
        formData.append(formKey, obj[property]);
      }
    }
  }

  return formData;
}
