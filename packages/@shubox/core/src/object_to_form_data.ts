export function objectToFormData(
  obj: object,
  form?: FormData,
  namespace?: string,
) {
  const formData = form || new (window as any).FormData();
  let formKey;

  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + "[" + property + "]";
      } else {
        formKey = property;
      }

      // if the property is an object/hash, and not a File,
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof (window as any).File)
      ) {
        objectToFormData(obj[property], formData, property);
      } else {
        formData.append(formKey, obj[property]);
      }
    }
  }

  return formData;
}
