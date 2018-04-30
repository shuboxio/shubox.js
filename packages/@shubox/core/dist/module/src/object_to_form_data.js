export function objectToFormData(obj, form, namespace) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0X3RvX2Zvcm1fZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvb2JqZWN0X3RvX2Zvcm1fZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLDJCQUNKLEdBQVcsRUFDWCxJQUFlLEVBQ2YsU0FBa0I7SUFFbEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLElBQVUsTUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BELElBQUksT0FBTyxDQUFDO0lBRVosS0FBSyxJQUFJLFFBQVEsSUFBSSxHQUFHLEVBQUU7UUFDeEIsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ2hDLElBQUksU0FBUyxFQUFFO2dCQUNiLE9BQU8sR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUM7YUFDNUM7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLFFBQVEsQ0FBQzthQUNwQjtZQUVELHFEQUFxRDtZQUNyRCxJQUNFLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVE7Z0JBQ2pDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQWtCLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFDOUM7Z0JBQ0EsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUNyRDtpQkFBTTtnQkFDTCxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUN6QztTQUNGO0tBQ0Y7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDIn0=