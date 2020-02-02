var ShuboxOptions = /** @class */ (function () {
    function ShuboxOptions(shubox) {
        this.shubox = shubox;
    }
    ShuboxOptions.prototype.toHash = function () {
        return {
            acceptedFiles: "image/*",
            addedfile: function (file) { },
            cdn: null,
            error: function (file, message) { },
            extraParams: {},
            previewsContainer: ["INPUT", "TEXTAREA"].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
            s3Key: null,
            sending: function (file, xhr, formData) { },
            success: function (file) { },
            successTemplate: "{{s3url}}",
            textBehavior: "replace",
            transformName: null,
            uploadingTemplate: "",
            webcam: null,
        };
    };
    return ShuboxOptions;
}());
export { ShuboxOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRU0sOEJBQU0sR0FBYjtRQUNFLE9BQU87WUFDTCxhQUFhLEVBQUUsU0FBUztZQUN4QixTQUFTLFlBQUMsSUFBSSxJQUFHLENBQUM7WUFDbEIsR0FBRyxFQUFFLElBQUk7WUFDVCxLQUFLLFlBQUMsSUFBSSxFQUFFLE9BQU8sSUFBRyxDQUFDO1lBQ3ZCLFdBQVcsRUFBRSxFQUFFO1lBQ2YsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2pHLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxZQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxJQUFHLENBQUM7WUFDL0IsT0FBTyxZQUFDLElBQUksSUFBRyxDQUFDO1lBQ2hCLGVBQWUsRUFBRSxXQUFXO1lBQzVCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO0lBQ0osQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQyJ9