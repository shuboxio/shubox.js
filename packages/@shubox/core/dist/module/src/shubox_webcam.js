var ShuboxWebcam = /** @class */ (function () {
    function ShuboxWebcam(dropzone, element, webcamOptions) {
        var _this = this;
        this.photoConstraints = { video: true };
        this.image = document.createElement("img");
        this.canvas = document.createElement("canvas");
        this.video = document.createElement("video");
        this.wireUpElements = function () {
            _this.element.addEventListener("click", _this.startCamera);
            if (typeof (_this.webcamOptions) === "string") {
                return;
            }
            if (_this.webcamOptions.startCamera) {
                document.querySelector(_this.webcamOptions.startCamera).addEventListener("click", _this.startCamera);
            }
            if (_this.webcamOptions.stopCamera) {
                document.querySelector(_this.webcamOptions.stopCamera).addEventListener("click", _this.stopVideo);
            }
            if (_this.webcamOptions.startCapture) {
                document.querySelector(_this.webcamOptions.startCapture).addEventListener("click", _this.startCapture);
            }
        };
        this.startCamera = function (event) {
            event.preventDefault();
            var el = _this.element;
            if (el.classList.contains("shubox-webcam-started")) {
                return;
            }
            var dzPreview = el.querySelector(".dz-preview");
            if (dzPreview) {
                dzPreview.remove();
            }
            el.classList.remove("shubox-webcam-stopped");
            el.classList.remove("shubox-webcam-captured");
            el.classList.remove("shubox-webcam-uninitialized");
            el.classList.add("shubox-webcam-started");
            _this.image.style.display = "none";
            _this.canvas.style.display = "none";
            _this.video.autoplay = true;
            _this.video.width = _this.image.width = el.offsetWidth;
            _this.video.height = _this.image.height = el.offsetHeight;
            _this.element.removeEventListener("click", _this.startCamera);
            _this.video.addEventListener("click", _this.startCapture);
            navigator
                .mediaDevices
                .getUserMedia(_this.photoConstraints)
                .then(function (stream) { _this.video.srcObject = stream; })
                .catch(function () { });
            el.appendChild(_this.video);
            el.appendChild(_this.canvas);
            el.appendChild(_this.image);
        };
        this.stopVideo = function (event) {
            event.preventDefault();
            var src = _this.video.srcObject;
            if (src) {
                src.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
            _this.element.classList.add("shubox-webcam-stopped");
            _this.element.classList.remove("shubox-webcam-started");
        };
        this.startCapture = function (event) {
            event.preventDefault();
            if (!_this.element.classList.contains("shubox-webcam-started")) {
                return;
            }
            _this.canvas.width = _this.video.videoWidth;
            _this.canvas.height = _this.video.videoHeight;
            _this.canvas.getContext("2d").drawImage(_this.video, 0, 0);
            _this.canvas.toBlob(function (blob) {
                var file = blob || new Blob();
                var dateTime = (new Date()).toISOString();
                file.name = "webcam-" + dateTime + ".png";
                _this.dropzone.addFile(file);
            });
            _this.image.src = _this.canvas.toDataURL("image/png");
            _this.image.style.display = "inline";
            _this.stopVideo(event);
            if (!!_this.video.parentElement) {
                _this.video.parentElement.removeChild(_this.canvas);
                _this.video.parentElement.removeChild(_this.video);
            }
            _this.element.classList.add("shubox-webcam-captured");
            _this.element.classList.add("shubox-webcam-stopped");
            _this.element.classList.remove("shubox-webcam-started");
        };
        this.element = element;
        this.dropzone = dropzone;
        this.webcamOptions = webcamOptions;
    }
    ShuboxWebcam.stopVideo = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        document.querySelectorAll(".shubox-video").forEach(function (video) {
            video.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
        });
        callback();
    };
    ShuboxWebcam.prototype.init = function () {
        this.video.classList.add("shubox-video");
        this.element.classList.add("shubox-webcam");
        this.element.classList.add("shubox-webcam-uninitialized");
        this.wireUpElements();
    };
    return ShuboxWebcam;
}());
export { ShuboxWebcam };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1Ym94X3dlYmNhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvc2h1Ym94X3dlYmNhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTtJQXFCRSxzQkFBWSxRQUFrQixFQUFFLE9BQW9CLEVBQUUsYUFBc0M7UUFBNUYsaUJBSUM7UUFiZ0IscUJBQWdCLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFLNUMsVUFBSyxHQUF1QixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELFdBQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3RCxVQUFLLEdBQXVCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFlNUQsbUJBQWMsR0FBRztZQUN2QixLQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFekQsSUFBSSxPQUFNLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFFeEQsSUFBSSxLQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtnQkFDbEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckc7WUFFRCxJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFO2dCQUNqQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNsRztZQUVELElBQUksS0FBSSxD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