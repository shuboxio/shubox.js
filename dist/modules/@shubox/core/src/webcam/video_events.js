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
var VideoEvents = /** @class */ (function () {
    function VideoEvents(webcam) {
        var _this = this;
        this.recordedBlobs = [];
        this.startCamera = function (event, constraints) {
            if (constraints === void 0) { constraints = {}; }
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (_this.webcam.dom.alreadyStarted()) {
                return;
            }
            _this.webcam.dom.init();
            _this.webcam.element.removeEventListener("click", _this.startCamera);
            constraints = {
                audio: __assign({ echoCancellation: { exact: true } }, constraints.audio),
                video: __assign({
                    height: _this.webcam.element.offsetHeight,
                    width: _this.webcam.element.offsetWidth,
                }, constraints.video),
            };
            navigator
                .mediaDevices
                .getUserMedia(constraints)
                .then(function (stream) { _this.webcam.dom.video.srcObject = stream; })
                .catch(function () { });
            _this.webcam.dom.toggleStarted();
            (_b = _this.webcam.webcamOptions.cameraStarted) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam);
        };
        this.stopCamera = function (event) {
            var _a, _b, _c;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            var src = _this.webcam.dom.video.srcObject;
            (_b = src) === null || _b === void 0 ? void 0 : _b.getTracks().forEach(function (track) { track.stop(); });
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_c = _this.webcam.webcamOptions.cameraStopped) === null || _c === void 0 ? void 0 : _c.call(_this, _this.webcam);
        };
        this.startRecording = function (event) {
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            _this.recordedBlobs = [];
            _this.mediaRecorder = new MediaRecorder(_this.webcam.dom.video.srcObject, _this.mediaRecorderOptions());
            _this.mediaRecorder.ondataavailable = _this.videoDataAvailable;
            _this.mediaRecorder.start(10);
            _this.webcam.dom.recordingStarted();
            (_b = _this.webcam.webcamOptions.recordingStarted) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam);
        };
        this.stopRecording = function (event) {
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            var file = new Blob(_this.recordedBlobs, { type: "video/webm" });
            var dateTime = (new Date()).toISOString();
            file.name = "webcam-video-" + dateTime + ".webm";
            _this.mediaRecorder.stop();
            (_b = _this.webcam.webcamOptions.recordingStopped) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam, file);
            _this.webcam.dropzone.addFile(file);
            _this.webcam.dom.finalize(file);
        };
        this.videoDataAvailable = function (event) {
            var _a;
            if (((_a = event) === null || _a === void 0 ? void 0 : _a.data.size) > 0) {
                _this.recordedBlobs.push(event.data);
            }
        };
        this.mediaRecorderOptions = function () {
            var mimeType = "";
            if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                mimeType = "video/webm;codecs=vp9";
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
                mimeType = "video/webm;codecs=vp8";
            }
            else if (MediaRecorder.isTypeSupported("video/webm")) {
                mimeType = "video/webm";
            }
            return { mimeType: mimeType };
        };
        this.webcam = webcam;
        this.webcam.element.addEventListener("click", this.startCamera);
        this.wireUpSelectorsAndEvents();
    }
    VideoEvents.prototype.wireUpSelectorsAndEvents = function () {
        this.webcam.element.addEventListener("click", this.startCamera);
        this.wireUp("startCamera");
        this.wireUp("stopCamera");
        this.wireUp("startRecording");
        this.wireUp("stopRecording");
    };
    VideoEvents.prototype.wireUp = function (eventName, selector) {
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
    return VideoEvents;
}());
export { VideoEvents };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFLRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBUE8sa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFTNUIsZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjtZQUFyQiw0QkFBQSxFQUFBLGdCQUFxQjs7WUFDeEQsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRW5FLFdBQVcsR0FBRztnQkFDWixLQUFLLFdBQ0MsRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUNuQyxXQUFXLENBQUMsS0FBSyxDQUN0QjtnQkFDRCxLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QyxFQUNFLFdBQVcsQ0FBQyxLQUFLLENBQ3JCO2FBQ0YsQ0FBQztZQUVGLFNBQVM7aUJBQ04sWUFBWTtpQkFDWixZQUFZLENBQUMsV0FBVyxDQUFDO2lCQUN6QixJQUFJLENBQUMsVUFBQyxNQUFNLElBQU8sS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFH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