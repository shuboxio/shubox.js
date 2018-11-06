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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsT0FBTyxJQUFHLENBQUM7WUFDakMsT0FBTyxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLElBQUcsQ0FBQztZQUN6QyxPQUFPLEVBQUUsVUFBUyxJQUFJLElBQUcsQ0FBQztZQUMxQixZQUFZLEVBQUUsU0FBUztZQUN2QixhQUFhLEVBQUUsV0FBVztZQUMxQixhQUFhLEVBQUUsU0FBUztZQUN4QixTQUFTLEVBQUUsSUFBSTtZQUNmLGVBQWUsRUFDYixFQUFFO2dCQUNGLDBDQUEwQztnQkFDMUMsNEJBQTRCO2dCQUM1QiwrREFBK0Q7Z0JBQy9ELDhDQUE4QztnQkFDOUMsK0JBQStCO2dCQUMvQixVQUFVO2dCQUNWLHlGQUF5RjtnQkFDekYscURBQXFEO2dCQUNyRCxtREFBbUQ7Z0JBQ25ELDBFQUEwRTtnQkFDMUUsUUFBUTtZQUNWLGlCQUFpQixFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNoRixDQUFDLENBQUMsS0FBSztnQkFDUCxDQUFDLENBQUMsSUFBSTtZQUNSLGFBQWEsRUFBRSxJQUFJO1lBQ25CLG9CQUFvQixFQUNsQiwyREFBMkQ7WUFDN0QsUUFBUSxFQUFFLElBQUk7WUFDZCxXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFBO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXZDRCxJQXVDQyJ9