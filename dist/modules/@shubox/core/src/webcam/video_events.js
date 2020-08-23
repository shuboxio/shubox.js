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
        this.alreadyStopped = false;
        this.startCamera = function (event, constraints) {
            if (constraints === void 0) { constraints = {}; }
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (_this.webcam.dom.alreadyStarted()) {
                return;
            }
            _this.webcam.dom.init();
            _this.webcam.element.removeEventListener("click", _this.startCamera);
            _this.webcam.dom.video.addEventListener("click", _this.startRecording);
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
            var _a, _b, _c, _d;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            var src = (_b = _this.webcam.dom.video) === null || _b === void 0 ? void 0 : _b.srcObject;
            (_c = src) === null || _c === void 0 ? void 0 : _c.getTracks().forEach(function (track) { var _a; (_a = track) === null || _a === void 0 ? void 0 : _a.stop(); });
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_d = _this.webcam.webcamOptions.cameraStopped) === null || _d === void 0 ? void 0 : _d.call(_this, _this.webcam);
        };
        this.startRecording = function (event) {
            var _a, _b, _c, _d;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (!((_b = _this.webcam.dom.video) === null || _b === void 0 ? void 0 : _b.srcObject)) {
                return;
            }
            if (typeof MediaRecorder === "undefined" && _this.isSafari()) {
                window.console.warn("WARNING: Your web browser, Safari, does not have MediaRecorder enabled.\n         You may enable it in the application menu under:\n         Develop > Experimental Features > MediaRecorder");
                return;
            }
            _this.recordedBlobs = [];
            _this.mediaRecorder = new MediaRecorder((_c = _this.webcam.dom.video) === null || _c === void 0 ? void 0 : _c.srcObject, _this.mediaRecorderOptions());
            _this.mediaRecorder.ondataavailable = _this.videoDataAvailable;
            _this.mediaRecorder.onstop = _this.recordingStopped;
            _this.mediaRecorder.start(10);
            if (_this.webcam.webcamOptions.timeLimit) {
                var timeout = _this.webcam.webcamOptions.timeLimit * 1000;
                setTimeout(_this.stopRecording, timeout);
            }
            _this.webcam.dom.video.removeEventListener("click", _this.startRecording);
            _this.webcam.dom.video.addEventListener("click", _this.stopRecording);
            _this.webcam.dom.recordingStarted();
            (_d = _this.webcam.webcamOptions.recordingStarted) === null || _d === void 0 ? void 0 : _d.call(_this, _this.webcam);
        };
        this.stopRecording = function (event) {
            var _a;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (!_this.mediaRecorder || _this.mediaRecorder.state !== "recording" || _this.alreadyStopped) {
                return;
            }
            _this.mediaRecorder.stop();
        };
        this.recordingStopped = function (event) {
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            var extension = _this.isSafari() ? "mp4" : "webm";
            var file = new Blob(_this.recordedBlobs, { type: "video/" + extension });
            var dateTime = (new Date()).toISOString();
            file.name = "webcam-video-" + dateTime + "." + extension;
            _this.webcam.dom.video.removeEventListener("click", _this.stopRecording);
            _this.webcam.dropzone.addFile(file);
            _this.webcam.dom.finalize(file);
            (_b = _this.webcam.webcamOptions.recordingStopped) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam);
        };
        this.videoDataAvailable = function (event) {
            var _a;
            if (((_a = event) === null || _a === void 0 ? void 0 : _a.data.size) > 0) {
                _this.recordedBlobs.push(event.data);
            }
        };
        this.mediaRecorderOptions = function () {
            var mimeType = "";
            if (typeof (MediaRecorder.isTypeSupported) === "undefined" && _this.isSafari()) {
                mimeType = "video/mp4";
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                mimeType = "video/webm;codecs=vp9";
            }
            else if (MediaRecorder.isTypeSupported('video/webm;codecs="vp8,opus"')) {
                mimeType = 'video/webm;codecs="vp8,opus"';
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
                mimeType = "video/webm;codecs=vp8";
            }
            else if (MediaRecorder.isTypeSupported("video/webm")) {
                mimeType = "video/webm";
            }
            return { mimeType: mimeType };
        };
        this.isSafari = function () {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("safari/") > -1 && ua.indexOf("chrome/") < 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFNRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBUk0sa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFFM0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRaEMsZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjtZQUFyQiw0QkFBQSxFQUFBLGdCQUFxQjs7WUFDeEQsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXJFLFdBQVcsR0FBRztnQkFDWixLQUFLLFdBQ0MsRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUNuQyxXQUFXLENBQUMsS0FBSyxDQUN0QjtnQkFDRCxLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QyxFQUNFLFdBQVcsQ0FBQyxLQUFL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