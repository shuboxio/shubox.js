var ShuboxOptions = {
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
export { ShuboxOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L2NvcmUvc3JjL3NodWJveF9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU0sYUFBYSxHQUFHO0lBQ3BCLEtBQUssRUFBRSxVQUFTLElBQUksRUFBRSxPQUFPLElBQUcsQ0FBQztJQUNqQyxPQUFPLEVBQUUsVUFBUyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsSUFBRyxDQUFDO0lBQ3pDLE9BQU8sRUFBRSxVQUFTLElBQUksSUFBRyxDQUFDO0lBQzFCLFlBQVksRUFBRSxTQUFTO0lBQ3ZCLGFBQWEsRUFBRSxXQUFXO0lBQzFCLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsZUFBZSxFQUNiLEVBQUU7UUFDRiwwQ0FBMEM7UUFDMUMsNEJBQTRCO1FBQzVCLCtEQUErRDtRQUMvRCw4Q0FBOEM7UUFDOUMsK0JBQStCO1FBQy9CLFVBQVU7UUFDVix5RkFBeUY7UUFDekYscURBQXFEO1FBQ3JELG1EQUFtRDtRQUNuRCwwRUFBMEU7UUFDMUUsUUFBUTtJQUNWLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsYUFBYSxFQUFFLElBQUk7SUFDbkIsb0JBQW9CLEVBQ2xCLDJEQUEyRDtJQUM3RCxRQUFRLEVBQUUsSUFBSTtJQUNkLFdBQVcsRUFBRSxFQUFFO0NBQ2hCLENBQUM7QUFFRixPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMifQ==