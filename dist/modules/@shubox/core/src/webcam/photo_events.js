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
                    height: _this.webcam.element.offsetHeight,
                    width: _this.webcam.element.offsetWidth,
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
            console.warn("`startCapture` is being deprecated in favor of `takePhoto`. Use `takePhoto` instead.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vcGhvdG9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFHRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBRU0sZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjtZQUFyQiw0QkFBQSxFQUFBLGdCQUFxQjs7WUFDeEQsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWhFLFdBQVcsR0FBRztnQkFDWixLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QyxFQUNFLFdBQVcsQ0FBQyxLQUFLLENBQ3JCO2FBQ0YsQ0FBQztZQUVGLFNBQVM7aUJBQ04sWUFBWTtpQkFDWixZQUFZLENBQUMsV0FBVyxDQUFDO2lCQUN6QixJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUNYLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxD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