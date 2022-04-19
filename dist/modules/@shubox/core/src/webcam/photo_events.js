var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var PhotoEvents = /** @class */ (function () {
    function PhotoEvents(webcam) {
        var _this = this;
        this.startCamera = function (event, constraints) {
            if (constraints === void 0) { constraints = {}; }
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (_this.webcam.dom.alreadyStarted()) {
                return;
            }
            _this.webcam.dom.init();
            _this.webcam.element.removeEventListener("click", _this.startCamera);
            _this.webcam.dom.video.addEventListener("click", _this.takePhoto);
            constraints = {
                audio: false,
                video: __assign({
                    height: _this.webcam.webcamOptions.portraitMode ? _this.webcam.element.offsetWidth : _this.webcam.element.offsetHeight,
                    width: _this.webcam.webcamOptions.portraitMode ? _this.webcam.element.offsetHeight : _this.webcam.element.offsetWidth
                }, constraints.video),
            };
            navigator
                .mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) {
                if (!_this.webcam.dom.video) {
                    return;
                }
                _this.webcam.dom.video.srcObject = stream;
            })
                .catch(function () { });
            _this.webcam.dom.toggleStarted();
            (_b = _this.webcam.webcamOptions.cameraStarted) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam);
        };
        this.takePhoto = function (event) {
            var _a, _b, _c, _d;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (!_this.webcam.dom.alreadyStarted()) {
                return;
            }
            var file;
            ((_b = _this.webcam.dom.canvas) === null || _b === void 0 ? void 0 : _b.getContext("2d")).drawImage(_this.webcam.dom.video, 0, 0);
            (_c = _this.webcam.dom.canvas) === null || _c === void 0 ? void 0 : _c.toBlob(function (blob) {
                var dateTime = (new Date()).toISOString();
                file = blob || new Blob();
                file.name = "webcam-" + dateTime + ".png";
                _this.webcam.dropzone.addFile(file);
            });
            _this.webcam.dom.finalize(file);
            (_d = _this.webcam.webcamOptions.photoTaken) === null || _d === void 0 ? void 0 : _d.call(_this, _this.webcam, file);
        };
        this.stopCamera = function (event) {
            var _a, _b, _c;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (!_this.webcam.dom.video) {
                return;
            }
            var src = _this.webcam.dom.video.srcObject;
            (_b = src) === null || _b === void 0 ? void 0 : _b.getTracks().forEach(function (track) { track.stop(); });
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_c = _this.webcam.webcamOptions.cameraStopped) === null || _c === void 0 ? void 0 : _c.call(_this, _this.webcam);
        };
        this.webcam = webcam;
        this.webcam.element.addEventListener("click", this.startCamera);
        this.wireUpSelectorsAndEvents();
    }
    PhotoEvents.prototype.wireUpSelectorsAndEvents = function () {
        var _a;
        this.wireUp("startCamera");
        this.wireUp("stopCamera");
        this.wireUp("takePhoto");
        if ((_a = this.webcam.webcamOptions) === null || _a === void 0 ? void 0 : _a.startCapture) {
            window.console.warn("`startCapture` is being deprecated in favor of `takePhoto`. Use `takePhoto` instead.");
            this.wireUp("takePhoto", this.webcam.webcamOptions.startCapture);
        }
    };
    PhotoEvents.prototype.wireUp = function (eventName, selector) {
        var _a;
        try {
            var el = document.querySelector(selector || this.webcam.webcamOptions[eventName]);
            (_a = el) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (this[eventName]));
        }
        catch (error) {
            if (!(error instanceof DOMException)) {
                throw error;
            }
        }
    };
    return PhotoEvents;
}());
export { PhotoEvents };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vcGhvdG9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFHRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBRU0sZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjtZQUFyQiw0QkFBQSxFQUFBLGdCQUFxQjs7WUFDeEQsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWhFLFdBQVcsR0FBRztnQkFDWixLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZO29CQUNuSCxLQUFLLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7aUJBQ25ILEVBQ0UsV0FBVyxDQUFDLEtBQUssQ0FDckI7YUFDRixDQUFDO1lBRUYsU0FBUztpQkFDTixZQUFZO2lCQUNaLFlBQVksQ0FBQyxXQUFXLENBQUM7aUJBQ3pCLElBQUksQ0FBQyxVQUFDLE1BQU07Z0JBQ1gsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtvQkFBRSxPQUFPO2lCQUFFO2dCQUN2QyxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUMzQyxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUM7WUFFbkIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDaEMsTUFBQSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLDBDQUFFLElBQUksQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRTtRQUNuRSxDQUFDLENBQUE7UUFFTSxjQUFTLEdBQUcsVUFBQyxLQUFhOztZQUMvQixNQUFBLEtBQUssMENBQUUsY0FBYyxHQUFHO1lBQ3hCLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFFbEQsSUFBSSxJQUFTLENBQUM7WUFDZCxDQUFBLE1BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSwwQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRixNQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sMENBQUUsTUFBTSxDQUFDLFVBQUMsSUFBVTtnQkFDeEMsSUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzVDLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFVLFFBQVEsU0FBTSxDQUFDO2dCQUNyQyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQyxFQUFFO1lBRUgsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQVksQ0FBQyxDQUFDO1lBQ3ZDLE1BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSwwQ0FBRSxJQUFJLENBQUMsS0FBSSxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsSUFBWSxFQUFFO1FBQzlFLENBQUMsQ0FBQTtRQUVNLGVBQVUsR0FBRyxVQUFDLEtBQWE7O1lBQ2hDLE1BQUEsS0FBSywwQ0FBRSxjQUFjLEdBQUc7WUFDeEIsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFFdkMsSUFBTSxHQUFHLEdBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQXlCLENBQUM7WUFDN0QsTUFBQSxHQUFHLDBDQUFFLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBQyxLQUFLLElBQU8sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBRXZELEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDaEMsTUFBQSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLDBDQUFFLElBQUksQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRTtRQUNuRSxDQUFDLENBQUE7UUFoRUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBK0RNLDhDQUF3QixHQUEvQjs7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6QixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSwwQ0FBRSxZQUFZLEVBQUU7WUFDM0MsTUFBTSxDQUFDLE9BQVEsQ0FBQyxJQUFJLENBQ2xCLHNGQUFzRixDQUN2RixDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRU0sNEJBQU0sR0FBYixVQUFjLFNBQWlCLEVBQUUsUUFBaUI7O1FBQ2hELElBQUk7WUFDRixJQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLE1BQUEsRUFBRSwwQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtTQUNsRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxFQUFFO2dCQUFFLE1BQU0sS0FBSyxDQUFDO2FBQUU7U0FDdkQ7SUFDSCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBM0ZELElBMkZDIn0=