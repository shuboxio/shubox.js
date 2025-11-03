function isFile(value: unknown): value is File {
  return value instanceof File;
}

export function objectToFormData(obj: object, form?: FormData, namespace?: string) {
  const formData = form || new FormData();
  let formKey;

  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object/hash, and not a File,
      const value = obj[property as keyof typeof obj];

      if (typeof value === 'object' && value !== null && !isFile(value)) {
        objectToFormData(value, formData, property);
      } else {
        formData.append(formKey, value);
      }
    }
  }

  return formData;
}
