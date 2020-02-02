import { Variant } from "./variant";
var TransformCallback = /** @class */ (function () {
    function TransformCallback(file, variant, callback) {
        var _this = this;
        if (variant === void 0) { variant = ""; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtX2NhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy90cmFuc2Zvcm1fY2FsbGJhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQU9sQztJQVFFLDJCQUFZLElBQWlCLEVBQUUsT0FBb0IsRUFBRSxRQUFxQztRQUExRixpQkFLQztRQUw4Qix3QkFBQSxFQUFBLFlBQW9CO1FBTjVDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUV4QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFTekIsUUFBRyxHQUFHLFVBQUMsS0FBaUI7WUFBakIsc0JBQUEsRUFBQSxZQUFpQjtZQUM3QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQTRCO1lBRXhFLElBQUksS0FBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLEtBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUVoQixVQUFVLENBQUM7b0JBQ1QsS0FBSyxDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQzt5QkFDN0MsSUFBSSxDQUFDLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDM0IsS0FBSyxDQUFDLEtBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ1g7UUFDSCxDQUFDLENBQUE7UUFFTSxxQkFBZ0IsR0FBRyxVQUFDLFFBQWE7WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0JBQUUsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQUU7WUFFdkQsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEUsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNoRSxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6QixPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLENBQUE7UUFFTyxtQkFBYyxHQUFHO1lBQ3ZCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUVqRSxPQUFVLEtBQUksQ0FBQyxVQUFVLFdBQU0sSUFBTSxDQUFDO1FBQ3hDLENBQUMsQ0FBQTtRQW5DQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBZ0NILHdCQUFDO0FBQUQsQ0FBQyxBQTdDRCxJQTZDQyJ9