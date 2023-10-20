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
            var _a;
            if (constraints === void 0) { constraints = {}; }
            event === null || event === void 0 ? void 0 : event.preventDefault();
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
            (_a = _this.webcam.webcamOptions.cameraStarted) === null || _a === void 0 ? void 0 : _a.call(_this, _this.webcam);
        };
        this.takePhoto = function (event) {
            var _a, _b, _c;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            if (!_this.webcam.dom.alreadyStarted()) {
                return;
            }
            var file;
            (_a = _this.webcam.dom.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d").drawImage(_this.webcam.dom.video, 0, 0);
            (_b = _this.webcam.dom.canvas) === null || _b === void 0 ? void 0 : _b.toBlob(function (blob) {
                var dateTime = (new Date()).toISOString();
                file = blob || new Blob();
                file.name = "webcam-" + dateTime + ".png";
                _this.webcam.dropzone.addFile(file);
            });
            _this.webcam.dom.finalize(file);
            (_c = _this.webcam.webcamOptions.photoTaken) === null || _c === void 0 ? void 0 : _c.call(_this, _this.webcam, file);
        };
        this.stopCamera = function (event) {
            var _a;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            if (!_this.webcam.dom.video) {
                return;
            }
            var src = _this.webcam.dom.video.srcObject;
            src === null || src === void 0 ? void 0 : src.getTracks().forEach(function (track) { track.stop(); });
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_a = _this.webcam.webcamOptions.cameraStopped) === null || _a === void 0 ? void 0 : _a.call(_this, _this.webcam);
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
        try {
            var el = document.querySelector(selector || this.webcam.webcamOptions[eventName]);
            el === null || el === void 0 ? void 0 : el.addEventListener("click", (this[eventName]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vcGhvdG9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFHRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBRU0sZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjs7WUFBckIsNEJBQUEsRUFBQSxnQkFBcUI7WUFDeEQsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWhFLFdBQVcsR0FBRztnQkFDWixLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QyxFQUNFLFdBQVcsQ0FBQyxLQUFLLENBQ3JCO2FBQ0YsQ0FBQztZQUVGLFNBQVM7aUJBQ04sWUFBWTtpQkFDWixZQUFZLENBQUMsV0FBVyxDQUFDO2lCQUN6QixJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUNYLElBQUksQ0FBQyxL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