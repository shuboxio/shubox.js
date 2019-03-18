export function objectToFormData(obj, form, namespace) {
    var formData = form || new window.FormData();
    var formKey;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + "[" + property + "]";
            }
            else {
                formKey = property;
            }
            // if the property is an object/hash, and not a File,
            if (typeof obj[property] === "object" &&
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0X3RvX2Zvcm1fZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvb2JqZWN0X3RvX2Zvcm1fZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsZ0JBQWdCLENBQzlCLEdBQVcsRUFDWCxJQUFlLEVBQ2YsU0FBa0I7SUFFbEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLElBQUssTUFBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hELElBQUksT0FBTyxDQUFDO0lBRVosS0FBSyxJQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7UUFDMUIsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2hDLElBQUksU0FBUyxFQUFFO2dCQUNiLE9BQU8sR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUM7YUFDNUM7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLFFBQVEsQ0FBQzthQUNwQjtZQUVELHFEQUFxRDtZQUNyRCxJQUNFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVE7Z0JBQ2pDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQWEsTUFBYyxDQUFDLElBQUksQ0FBQyxFQUNoRDtnQkFDQSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3JEO2lCQUFNO2dCQUNMLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0Y7S0FDRjtJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUMifQ==