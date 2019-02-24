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
                    fetch(_this._cacheBustedUrl(), { method: 'HEAD' })
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
        this._cacheBustedUrl = function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtX2NhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy90cmFuc2Zvcm1fY2FsbGJhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQU9sQztJQVFFLDJCQUFZLElBQWdCLEVBQUUsT0FBb0IsRUFBRSxRQUFvQztRQUExRCx3QkFBQSxFQUFBLFlBQW9CO1FBQWxELGlCQUtDO1FBWEQsWUFBTyxHQUFXLEVBQUUsQ0FBQTtRQUNwQixlQUFVLEdBQVcsRUFBRSxDQUFBO1FBRXZCLFVBQUssR0FBVyxFQUFFLENBQUE7UUFDbEIsWUFBTyxHQUFZLEtBQUssQ0FBQTtRQVN4QixRQUFHLEdBQUcsVUFBQyxLQUFpQjtZQUFqQixzQkFBQSxFQUFBLFlBQWlCO1lBQ3RCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyw0QkFBNEI7WUFFckUsSUFBRyxLQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRTtnQkFDOUIsS0FBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7Z0JBRWYsVUFBVSxDQUFDO29CQUNULEtBQUssQ0FBQyxLQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7eUJBQzlDLElBQUksQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUM7eUJBQzNCLEtBQUssQ0FBQyxLQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3BCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTthQUNWO1FBQ0gsQ0FBQyxDQUFBO1FBRUQscUJBQWdCLEdBQUcsVUFBQyxRQUFhO1lBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUFFLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQTthQUFFO1lBRXRELEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ25CLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1lBQ3ZFLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDL0QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFeEIsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQyxDQUFBO1FBRUQsb0JBQWUsR0FBRztZQUNoQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7WUFFOUQsT0FBVSxLQUFJLENBQUMsVUFBVSxXQUFNLElBQU0sQ0FBQTtRQUN2QyxDQUFDLENBQUE7UUFuQ0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDbEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7SUFDMUIsQ0FBQztJQWdDSCx3QkFBQztBQUFELENBQUMsQUE3Q0QsSUE2Q0MifQ==