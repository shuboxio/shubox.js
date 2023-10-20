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
            var _a;
            if (constraints === void 0) { constraints = {}; }
            event === null || event === void 0 ? void 0 : event.preventDefault();
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
            (_a = _this.webcam.webcamOptions.cameraStarted) === null || _a === void 0 ? void 0 : _a.call(_this, _this.webcam);
        };
        this.stopCamera = function (event) {
            var _a;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            _this._stopTracks();
            _this.webcam.element.addEventListener("click", _this.startCamera);
            _this.webcam.dom.toggleStopped();
            (_a = _this.webcam.webcamOptions.cameraStopped) === null || _a === void 0 ? void 0 : _a.call(_this, _this.webcam);
        };
        this.startRecording = function (event) {
            var _a, _b, _c;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            if (!((_a = _this.webcam.dom.video) === null || _a === void 0 ? void 0 : _a.srcObject)) {
                return;
            }
            if (typeof MediaRecorder === "undefined" && _this.isSafari()) {
                window.console.warn("WARNING: Your web browser, Safari, does not have MediaRecorder enabled.\n         You may enable it in the application menu under:\n         Develop > Experimental Features > MediaRecorder");
                return;
            }
            _this.recordedBlobs = [];
            _this.mediaRecorder = new MediaRecorder((_b = _this.webcam.dom.video) === null || _b === void 0 ? void 0 : _b.srcObject, _this.mediaRecorderOptions());
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
            (_c = _this.webcam.webcamOptions.recordingStarted) === null || _c === void 0 ? void 0 : _c.call(_this, _this.webcam);
        };
        this.stopRecording = function (event) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            if (!_this.mediaRecorder || _this.mediaRecorder.state !== "recording" || _this.alreadyStopped) {
                return;
            }
            _this._stopTracks();
            _this.mediaRecorder.stop();
        };
        this._stopTracks = function () {
            var _a;
            var src = (_a = _this.webcam.dom.video) === null || _a === void 0 ? void 0 : _a.srcObject;
            src === null || src === void 0 ? void 0 : src.getTracks().forEach(function (track) { track === null || track === void 0 ? void 0 : track.stop(); });
        };
        this.recordingStopped = function (event) {
            var _a;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            var extension = _this.isSafari() ? "mp4" : "webm";
            var file = new Blob(_this.recordedBlobs, { type: "video/" + extension });
            var dateTime = (new Date()).toISOString();
            file.name = "webcam-video-" + dateTime + "." + extension;
            _this.webcam.dom.video.removeEventListener("click", _this.stopRecording);
            _this.webcam.dropzone.addFile(file);
            _this.webcam.dom.finalize(file);
            (_a = _this.webcam.webcamOptions.recordingStopped) === null || _a === void 0 ? void 0 : _a.call(_this, _this.webcam);
        };
        this.videoDataAvailable = function (event) {
            if ((event === null || event === void 0 ? void 0 : event.data.size) > 0) {
                _this.recordedBlobs.push(event.data);
            }
        };
        this.mediaRecorderOptions = function () {
            var mimeType = "";
            if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
                mimeType = "video/webm;codecs=vp9,opus";
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
                mimeType = "video/webm;codecs=vp8,opus";
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                mimeType = "video/webm;codecs=vp9";
            }
            else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
                mimeType = "video/webm;codecs=vp8";
            }
            else if (MediaRecorder.isTypeSupported("video/webm")) {
                mimeType = "video/webm";
            }
            else if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a")) {
                mimeType = "video/mp4;codecs=avc1,mp4a";
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
    return VideoEvents;
}());
export { VideoEvents };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFNRSxxQkFBWSxNQUFjO1FBQTFCLGlCQUlDO1FBUk0sa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFFM0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFRaEMsZ0JBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxXQUFxQjs7WUFBckIsNEJBQUEsRUFBQSxnQkFBcUI7WUFDeEQsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVqRCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25FLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXJFLFdBQVcsR0FBRztnQkFDWixLQUFLLFdBQ0MsRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUNuQyxXQUFXLENBQUMsS0FBSyxDQUN0QjtnQkFDRCxLQUFLLFdBQ0M7b0JBQ0YsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QyxFQUNF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