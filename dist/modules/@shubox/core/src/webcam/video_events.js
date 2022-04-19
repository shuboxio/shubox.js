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
                    height: _this.webcam.webcamOptions.portraitMode ? _this.webcam.element.offsetWidth : _this.webcam.element.offsetHeight,
                    width: _this.webcam.webcamOptions.portraitMode ? _this.webcam.element.offsetHeight : _this.webcam.element.offsetWidth
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
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            _this._stopTracks();
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_b = _this.webcam.webcamOptions.cameraStopped) === null || _b === void 0 ? void 0 : _b.call(_this, _this.webcam);
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
            _this._stopTracks();
            _this.mediaRecorder.stop();
        };
        this._stopTracks = function () {
            var _a, _b;
            var src = (_a = _this.webcam.dom.video) === null || _a === void 0 ? void 0 : _a.srcObject;
            (_b = src) === null || _b === void 0 ? void 0 : _b.getTracks().forEach(function (track) { var _a; (_a = track) === null || _a === void 0 ? void 0 : _a.stop(); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFNRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBUk0sa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFFM0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRaEMsZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjtZQUFyQiw0QkFBQSxFQUFBLGdCQUFxQjs7WUFDeEQsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXJFLFdBQVcsR0FBRztnQkFDWixLQUFLLFdBQ0MsRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUNuQyxXQUFXLENBQUMsS0FBSyxDQUN0QjtnQkFDRCxLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFB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