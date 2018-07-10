export var ShuboxOptions = {
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
    previewsContainer: null,
    transformName: null,
    dictMaxFilesExceeded: 'Your file limit of {{maxFiles}} file(s) has been reached.',
    maxFiles: null,
    extraParams: {},
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRztJQUMzQixLQUFLLEVBQUUsVUFBUyxJQUFJLEVBQUUsT0FBTyxJQUFHLENBQUM7SUFDakMsT0FBTyxFQUFFLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLElBQUcsQ0FBQztJQUN6QyxPQUFPLEVBQUUsVUFBUyxJQUFJLElBQUcsQ0FBQztJQUMxQixZQUFZLEVBQUUsU0FBUztJQUN2QixhQUFhLEVBQUUsV0FBVztJQUMxQixhQUFhLEVBQUUsU0FBUztJQUN4QixTQUFTLEVBQUUsSUFBSTtJQUNmLGVBQWUsRUFDYixFQUFFO1FBQ0YsMENBQTBDO1FBQzFDLDRCQUE0QjtRQUM1QiwrREFBK0Q7UUFDL0QsOENBQThDO1FBQzlDLCtCQUErQjtRQUMvQixVQUFVO1FBQ1YseUZBQXlGO1FBQ3pGLHFEQUFxRDtRQUNyRCxtREFBbUQ7UUFDbkQsMEVBQTBFO1FBQzFFLFFBQVE7SUFDVixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLG9CQUFvQixFQUNsQiwyREFBMkQ7SUFDN0QsUUFBUSxFQUFFLElBQUk7SUFDZCxXQUFXLEVBQUUsRUFBRTtDQUNoQixDQUFDIn0=