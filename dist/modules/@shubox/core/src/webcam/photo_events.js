var PhotoEvents = /** @class */ (function () {
    function PhotoEvents(webcam) {
        var _this = this;
        this.startCamera = function (event) {
            var _a, _b;
            (_a = event) === null || _a === void 0 ? void 0 : _a.preventDefault();
            if (_this.webcam.dom.alreadyStarted()) {
                return;
            }
            _this.webcam.dom.init();
            _this.webcam.element.removeEventListener("click", _this.startCamera);
            _this.webcam.dom.video.addEventListener("click", _this.takePhoto);
            navigator
                .mediaDevices
                .getUserMedia({
                audio: false,
                video: {
                    height: _this.webcam.element.offsetHeight,
                    width: _this.webcam.element.offsetWidth,
                },
            })
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
            _this.webcam.dom.finalize(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9fZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vcGhvdG9fZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0lBR0UscUJBQVksTUFBYztRQUExQixpQkFJQztRQUVNLGdCQUFXLEdBQUcsVUFBQyxLQUFhOztZQUNqQyxNQUFBLEtBQUssMENBQUUsY0FBYyxHQUFHO1lBQ3hCLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRWpELEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFaEUsU0FBUztpQkFDTixZQUFZO2lCQUNaLFlBQVksQ0FBQztnQkFDWixLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7b0JBQ3hDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO2lCQUN2QzthQUNGLENBQUM7aUJBQ0QsSUFBSSxDQUFDLFVBQUMsTUFBTTtnQkFDWCxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO29CQUFFLE9BQU87aUJBQUU7Z0JBQ3ZDLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQzNDLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQztZQUVuQixLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNoQyxNQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsMENBQUUsSUFBSSxDQUFDLEtBQUksRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFO1FBQ25FLENBQUMsQ0FBQTtRQUVNLGNBQVMsR0FBRyxVQUFDLEtBQWE7O1lBQy9CLE1BQUEsS0FBSywwQ0FBRSxjQUFjLEdBQUc7WUFDeEIsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUVsRCxJQUFJLElBQVMsQ0FBQztZQUNkLENBQUEsTUFBQSxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLE1BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSwwQ0FBRSxNQUFNLENBQUMsVUFBQyxJQUFVO2dCQUN4QyxJQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVUsUUFBUSxTQUFNLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxDQUFDLEVBQUU7WUFFSCxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsTUFBQSxLQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLDBDQUFFLElBQUksQ0FBQyxLQUFJLEVBQUUsS0FBSSxDQUFDLE1BQU0sRUFBRSxJQUFZLEVBQUU7UUFDOUUsQ0FBQyxDQUFBO1FBRU0sZUFBVSxHQUFHLFVBQUMsS0FBYTs7WUFDaEMsTUFBQSxLQUFLLDBDQUFFLGNBQWMsR0FBRztZQUN4QixJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUV2QyxJQUFNLEdBQUcsR0FBSSxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBeUIsQ0FBQztZQUM3RCxNQUFBLEdBQUcsMENBQUUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxVQUFDLEtBQUssSUFBTyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFdkQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRSxLQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNoQyxNQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsMENBQUUsSUFBSSxDQUFDLEtBQUksRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFO1FBQ25FLENBQUMsQ0FBQTtRQTNEQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUEwRE8sOENBQXdCLEdBQWhDOztRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXpCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLDBDQUFFLFlBQVksRUFBRTtZQUMzQyxPQUFPLENBQUMsSUFBSSxDQUNWLHNGQUFzRixDQUN2RixDQUFDO1lBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRU8sNEJBQU0sR0FBZCxVQUFlLFNBQWlCLEVBQUUsUUFBaUI7O1FBQ2pELElBQUk7WUFDRixJQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLE1BQUEsRUFBRSwwQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtTQUNsRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFlBQVksQ0FBQyxFQUFFO2dCQUFFLE1BQU0sS0FBSyxDQUFDO2FBQUU7U0FDdkQ7SUFDSCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBdEZELElBc0ZDIn0=