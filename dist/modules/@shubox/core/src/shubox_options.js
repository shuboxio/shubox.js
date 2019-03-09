var ShuboxOptions = /** @class */ (function () {
    function ShuboxOptions(shubox) {
        this.shubox = shubox;
    }
    ShuboxOptions.prototype.toHash = function () {
        return {
            cdn: null,
            addedfile: function (file) { },
            error: function (file, message) { },
            sending: function (file, xhr, formData) { },
            success: function (file) { },
            textBehavior: 'replace',
            successTemplate: '{{s3url}}',
            uploadingTemplate: '',
            acceptedFiles: 'image/*',
            s3Key: null,
            previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
            transformName: null,
            extraParams: {},
        };
    };
    return ShuboxOptions;
}());
export { ShuboxOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSTtZQUNULFNBQVMsRUFBRSxVQUFTLElBQUksSUFBRyxDQUFDO1lBQzVCLEtBQUssRUFBRSxVQUFTLElBQUksRUFBRSxPQUFPLElBQUcsQ0FBQztZQUNqQyxPQUFPLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsSUFBRyxDQUFDO1lBQ3pDLE9BQU8sRUFBRSxVQUFTLElBQUksSUFBRyxDQUFDO1lBQzFCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLGVBQWUsRUFBRSxXQUFXO1lBQzVCLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsS0FBSyxFQUFFLElBQUk7WUFDWCxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDakcsYUFBYSxFQUFFLElBQUk7WUFDbkIsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQTtJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUF4QkQsSUF3QkMifQ==