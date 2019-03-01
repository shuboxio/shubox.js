var ShuboxOptions = /** @class */ (function () {
    function ShuboxOptions(shubox) {
        this.shubox = shubox;
    }
    ShuboxOptions.prototype.toHash = function () {
        return {
            cdn: null,
            addedfile: function (file) { },
            error: function (file, message) { },
            queuecomplete: function () { },
            sending: function (file, xhr, formData) { },
            success: function (file) { },
            textBehavior: 'replace',
            successTemplate: '{{s3url}}',
            uploadingTemplate: '',
            acceptedFiles: 'image/*',
            clickable: true,
            s3Key: null,
            previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0 ? false : null,
            transformName: null,
            dictMaxFilesExceeded: 'Your file limit of {{maxFiles}} file(s) has been reached.',
            maxFiles: null,
            extraParams: {},
        };
    };
    return ShuboxOptions;
}());
export { ShuboxOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSTtZQUNULFNBQVMsRUFBRSxVQUFTLElBQUksSUFBRyxDQUFDO1lBQzVCLEtBQUssRUFBRSxVQUFTLElBQUksRUFBRSxPQUFPLElBQUcsQ0FBQztZQUNqQyxhQUFhLEVBQUUsY0FBWSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxJQUFHLENBQUM7WUFDekMsT0FBTyxFQUFFLFVBQVMsSUFBSSxJQUFHLENBQUM7WUFDMUIsWUFBWSxFQUFFLFNBQVM7WUFDdkIsZUFBZSxFQUFFLFdBQVc7WUFDNUIsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixhQUFhLEVBQUUsU0FBUztZQUN4QixTQUFTLEVBQUUsSUFBSTtZQUNmLEtBQUssRUFBRSxJQUFJO1lBQ1gsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2pHLGFBQWEsRUFBRSxJQUFJO1lBQ25CLG9CQUFvQixFQUNsQiwyREFBMkQ7WUFDN0QsUUFBUSxFQUFFLElBQUk7WUFDZCxXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTdCRCxJQTZCQyJ9