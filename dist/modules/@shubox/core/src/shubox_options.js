var ShuboxOptions = /** @class */ (function () {
    function ShuboxOptions(shubox) {
        this.shubox = shubox;
    }
    ShuboxOptions.prototype.toHash = function () {
        return {
            error: function (file, message) { },
            sending: function (file, xhr, formData) { },
            success: function (file) { },
            textBehavior: 'replace',
            s3urlTemplate: '{{s3url}}',
            successTemplate: '{{s3url}}',
            uploadingTemplate: '',
            acceptedFiles: 'image/*',
            clickable: true,
            previewTemplate: '' +
                '<div class="dz-preview dz-file-preview">' +
                '  <div class="dz-details">' +
                '    <div class="dz-filename"><span data-dz-name></span></div>' +
                '    <div class="dz-size" data-dz-size></div>' +
                '    <img data-dz-thumbnail />' +
                '  </div>' +
                '  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>' +
                '  <div class="dz-success-mark"><span>✔</span></div>' +
                '  <div class="dz-error-mark"><span>✘</span></div>' +
                '  <div class="dz-error-message"><span data-dz-errormessage></span></div>' +
                '</div>',
            previewsContainer: ['INPUT', 'TEXTAREA'].indexOf(this.shubox.element.tagName) >= 0
                ? false
                : null,
            transformName: null,
            dictMaxFilesExceeded: 'Your file limit of {{maxFiles}} file(s) has been reached.',
            maxFiles: null,
            extraParams: {},
        };
    };
    return ShuboxOptions;
}());
export { ShuboxOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsT0FBTyxJQUFHLENBQUM7WUFDakMsT0FBTyxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLElBQUcsQ0FBQztZQUN6QyxPQUFPLEVBQUUsVUFBUyxJQUFJLElBQUcsQ0FBQztZQUMxQixZQUFZLEVBQUUsU0FBUztZQUN2QixhQUFhLEVBQUUsV0FBVztZQUMxQixlQUFlLEVBQUUsV0FBVztZQUM1QixpQkFBaUIsRUFBRSxFQUFFO1lBQ3JCLGFBQWEsRUFBRSxTQUFTO1lBQ3hCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsZUFBZSxFQUNiLEVBQUU7Z0JBQ0YsMENBQTBDO2dCQUMxQyw0QkFBNEI7Z0JBQzVCLCtEQUErRDtnQkFDL0QsOENBQThDO2dCQUM5QywrQkFBK0I7Z0JBQy9CLFVBQVU7Z0JBQ1YseUZBQXlGO2dCQUN6RixxREFBcUQ7Z0JBQ3JELG1EQUFtRDtnQkFDbkQsMEVBQTBFO2dCQUMxRSxRQUFRO1lBQ1YsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hGLENBQUMsQ0FBQyxLQUFLO2dCQUNQLENBQUMsQ0FBQyxJQUFJO1lBQ1IsYUFBYSxFQUFFLElBQUk7WUFDbkIsb0JBQW9CLEVBQ2xCLDJEQUEyRDtZQUM3RCxRQUFRLEVBQUUsSUFBSTtZQUNkLFdBQVcsRUFBRSxFQUFFO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBekNELElBeUNDIn0=