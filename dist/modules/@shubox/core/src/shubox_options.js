var ShuboxOptions = /** @class */ (function () {
    function ShuboxOptions(shubox) {
        this.shubox = shubox;
    }
    ShuboxOptions.prototype.toHash = function () {
        return {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxTQUFTLEVBQUUsVUFBUyxJQUFJLElBQUcsQ0FBQztZQUM1QixLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsT0FBTyxJQUFHLENBQUM7WUFDakMsYUFBYSxFQUFFLGNBQVksQ0FBQztZQUM1QixPQUFPLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsSUFBRyxDQUFDO1lBQ3pDLE9BQU8sRUFBRSxVQUFTLElBQUksSUFBRyxDQUFDO1lBQzFCLFlBQVksRUFBRSxTQUFTO1lBQ3ZCLGVBQWUsRUFBRSxXQUFXO1lBQzVCLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsYUFBYSxFQUFFLFNBQVM7WUFDeEIsU0FBUyxFQUFFLElBQUk7WUFDZixlQUFlLEVBQ2IsRUFBRTtnQkFDRiwwQ0FBMEM7Z0JBQzFDLDRCQUE0QjtnQkFDNUIsK0RBQStEO2dCQUMvRCw4Q0FBOEM7Z0JBQzlDLCtCQUErQjtnQkFDL0IsVUFBVTtnQkFDVix5RkFBeUY7Z0JBQ3pGLHFEQUFxRDtnQkFDckQsbURBQW1EO2dCQUNuRCwwRUFBMEU7Z0JBQzFFLFFBQVE7WUFDVixpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDaEYsQ0FBQyxDQUFDLEtBQUs7Z0JBQ1AsQ0FBQyxDQUFDLElBQUk7WUFDUixhQUFhLEVBQUUsSUFBSTtZQUNuQixvQkFBb0IsRUFDbEIsMkRBQTJEO1lBQzdELFFBQVEsRUFBRSxJQUFJO1lBQ2QsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQTtJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUExQ0QsSUEwQ0MifQ==