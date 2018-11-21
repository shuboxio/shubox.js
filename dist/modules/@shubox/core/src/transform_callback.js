import { Variant } from './variant';
var TransformCallback = /** @class */ (function () {
    function TransformCallback(file, variant, callback) {
        if (variant === void 0) { variant = ""; }
        var _this = this;
        this.variant = "";
        this.variantUrl = "";
        this.retry = 10;
        this.success = false;
        this.run = function (error) {
            if (error === void 0) { error = null; }
            var delay = Math.pow(2, 19 - _this.retry); // 512, 1024, 2048, 4096 ...
            if (_this.retry && !_this.success) {
                _this.retry -= 1;
                setTimeout(function () {
                    fetch(_this.variantUrl, { method: 'HEAD' })
                        .then(_this.validateResponse)
                        .catch(_this.run);
                }, delay);
            }
        };
        this.validateResponse = function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            _this.success = true;
            _this.file.transforms = _this.file.transforms ? _this.file.transforms : {};
            _this.file.transforms[_this.variant] = { s3url: _this.variantUrl };
            _this.callback(_this.file);
            return response;
        };
        this.file = file;
        this.variant = variant;
        this.variantUrl = new Variant(file, variant).url();
        this.callback = callback;
    }
    return TransformCallback;
}());
export { TransformCallback };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtX2NhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy90cmFuc2Zvcm1fY2FsbGJhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQU9sQztJQVFFLDJCQUFZLElBQWdCLEVBQUUsT0FBb0IsRUFBRSxRQUFvQztRQUExRCx3QkFBQSxFQUFBLFlBQW9CO1FBQWxELGlCQUtDO1FBWEQsWUFBTyxHQUFXLEVBQUUsQ0FBQTtRQUNwQixlQUFVLEdBQVcsRUFBRSxDQUFBO1FBRXZCLFVBQUssR0FBVyxFQUFFLENBQUE7UUFDbEIsWUFBTyxHQUFZLEtBQUssQ0FBQTtRQVN4QixRQUFHLEdBQUcsVUFBQyxLQUFpQjtZQUFqQixzQkFBQSxFQUFBLFlBQWlCO1lBQ3RCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyw0QkFBNEI7WUFFckUsSUFBRyxLQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsS0FBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7Z0JBRWYsVUFBVSxDQUFDO29CQUNULEtBQUssQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO3lCQUN2QyxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDO3lCQUMzQixLQUFLLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNwQixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7YUFDVjtRQUNILENBQUMsQ0FBQTtRQUVELHFCQUFnQixHQUFHLFVBQUMsUUFBYTtZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFBRSxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7YUFBRTtZQUV0RCxLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtZQUNuQixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUN2RSxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQy9ELEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRXhCLE9BQU8sUUFBUSxDQUFBO1FBQ2pCLENBQUMsQ0FBQTtRQTdCQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtJQUMxQixDQUFDO0lBMEJILHdCQUFDO0FBQUQsQ0FBQyxBQXZDRCxJQXVDQyJ9