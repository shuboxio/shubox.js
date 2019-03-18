import { Variant } from "./variant";
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
                    fetch(_this.cacheBustedUrl(), { method: "HEAD" })
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
        this.cacheBustedUrl = function () {
            var rand = Math.floor(Math.random() * Math.floor(10000000000));
            return _this.variantUrl + "?q=" + rand;
        };
        this.file = file;
        this.variant = variant;
        this.variantUrl = new Variant(file, variant).url();
        this.callback = callback;
    }
    return TransformCallback;
}());
export { TransformCallback };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtX2NhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy90cmFuc2Zvcm1fY2FsbGJhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQU9sQztJQVFFLDJCQUFZLElBQWlCLEVBQUUsT0FBb0IsRUFBRSxRQUFxQztRQUEzRCx3QkFBQSxFQUFBLFlBQW9CO1FBQW5ELGlCQUtDO1FBWE0sWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUNyQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBRXhCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQVN6QixRQUFHLEdBQUcsVUFBQyxLQUFpQjtZQUFqQixzQkFBQSxFQUFBLFlBQWlCO1lBQzdCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBNEI7WUFFeEUsSUFBSSxLQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRTtnQkFDL0IsS0FBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBRWhCLFVBQVUsQ0FBQztvQkFDVCxLQUFLLENBQUMsS0FBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO3lCQUM3QyxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDO3lCQUMzQixLQUFLLENBQUMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDWDtRQUNILENBQUMsQ0FBQTtRQUVNLHFCQUFnQixHQUFHLFVBQUMsUUFBYTtZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFBRSxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7YUFBRTtZQUV2RCxLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUNwQixLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN4RSxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hFLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXpCLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsQ0FBQTtRQUVPLG1CQUFjLEdBQUc7WUFDdkIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRWpFLE9BQVUsS0FBSSxDQUFDLFVBQVUsV0FBTSxJQUFNLENBQUM7UUFDeEMsQ0FBQyxDQUFBO1FBbkNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFnQ0gsd0JBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDIn0=