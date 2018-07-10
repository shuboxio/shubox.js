var ShuboxFormCallbacks = /** @class */ (function () {
    // private options: ShuboxDefaultOptions;
    function ShuboxFormCallbacks(shubox) {
        this.shubox = shubox;
    }
    ShuboxFormCallbacks.prototype.success = function (file, response) {
        this.shubox.element.classList.add('shubox-success');
        this.shubox.element.classList.remove('shubox-uploading');
        // let match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
        // let url = match[1];
        // url = url.replace(/%2F/g, '/');
        // file.s3url = url;
        // file.transformName = (this.options.transformName || this.shubox.element.dataset.shuboxTransform || "")
        //
        // let s3urlInterpolated = this.options.s3urlTemplate || ''
        // s3urlInterpolated = s3urlInterpolated.replace('{{s3url}}', url);
        //
        // if(this.shubox.element.tagName == 'TEXTAREA' && this.options.textBehavior == 'insertAtCursor') {
        //   insertAtCursor(this.shubox.element, s3urlInterpolated);
        // } else if(this.options.textBehavior == 'append'){
        //   this.shubox.element.value = this.shubox.element.value + s3urlInterpolated;
        // } else {
        //   this.shubox.element.value = s3urlInterpolated;
        // }
        //
        // // self.uploadWebhook(file);
        // Dropzone.prototype.defaultOptions.success(file);
        // this.options.success(file);
        // // this.fileName = '';
    };
    return ShuboxFormCallbacks;
}());
export { ShuboxFormCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2Zvcm1fY2FsbGJhY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy9zaHVib3hfZm9ybV9jYWxsYmFja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7SUFFRSx5Q0FBeUM7SUFFekMsNkJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQscUNBQU8sR0FBUCxVQUFRLElBQUksRUFBRSxRQUFRO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFekQsNEVBQTRFO1FBQzVFLHNCQUFzQjtRQUN0QixrQ0FBa0M7UUFDbEMsb0JBQW9CO1FBQ3BCLHlHQUF5RztRQUN6RyxFQUFFO1FBQ0YsMkRBQTJEO1FBQzNELG1FQUFtRTtRQUNuRSxFQUFFO1FBQ0YsbUdBQW1HO1FBQ25HLDREQUE0RDtRQUM1RCxvREFBb0Q7UUFDcEQsK0VBQStFO1FBQy9FLFdBQVc7UUFDWCxtREFBbUQ7UUFDbkQsSUFBSTtRQUNKLEVBQUU7UUFDRiwrQkFBK0I7UUFDL0IsbURBQW1EO1FBQ25ELDhCQUE4QjtRQUM5Qix5QkFBeUI7SUFDM0IsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQWxDRCxJQWtDQyJ9