import * as Dropzone from 'dropzone';
import { insertAtCursor } from './insert_at_cursor';
var ShuboxFormCallbacks = /** @class */ (function () {
    function ShuboxFormCallbacks(shubox) {
        this.options = {};
        this.shubox = shubox;
        this.element = shubox.element;
        this.options = shubox.options;
    }
    ShuboxFormCallbacks.prototype.toHash = function () {
        return {
            success: function (file, response) {
                this.element.classList.add('shubox-success');
                this.element.classList.remove('shubox-uploading');
                var match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
                file.s3url = match[1].replace(/%2F/g, '/');
                file.transformName = (this.options.transformName ||
                    this.element.dataset.shuboxTransform || "");
                var s3urlInterpolated = this.options.s3urlTemplate || '';
                s3urlInterpolated = s3urlInterpolated.replace('{{s3url}}', file.s3url);
                if (this.element.tagName == 'TEXTAREA' && this.options.textBehavior == 'insertAtCursor') {
                    insertAtCursor(this.element, s3urlInterpolated);
                }
                else if (this.options.textBehavior == 'append') {
                    this.element.value = this.element.value + s3urlInterpolated;
                }
                else {
                    this.element.value = s3urlInterpolated;
                }
                Dropzone.prototype.defaultOptions.success(file, {});
                this.options.success(file);
            }.bind(this)
        };
    };
    return ShuboxFormCallbacks;
}());
export { ShuboxFormCallbacks };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X2Zvcm1fY2FsbGJhY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy9zaHVib3hfZm9ybV9jYWxsYmFja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR2xEO0lBS0UsNkJBQVksTUFBYztRQUZuQixZQUFPLEdBQVEsRUFBRSxDQUFDO1FBR3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQTJCLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxvQ0FBTSxHQUFOO1FBQ0UsT0FBTztZQUNMLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxRQUFRO2dCQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBRWxELElBQUksS0FBSyxHQUFHLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDekUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7b0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQzdDLENBQUE7Z0JBRUQsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUE7Z0JBQ3hELGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV2RSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxnQkFBZ0IsRUFBRTtvQkFDdEYsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztpQkFFakQ7cUJBQU0sSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxRQUFRLEVBQUM7b0JBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGlCQUFpQixDQUFDO2lCQUU3RDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxpQkFBaUIsQ0FBQztpQkFDeEM7Z0JBRUQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDYixDQUFBO0lBQ0gsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQTFDRCxJQTBDQyJ9