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
import { DeviceSelection } from "./device_selection";
var VideoDom = /** @class */ (function () {
    function VideoDom(webcam) {
        this.webcam = webcam;
        this.options = __assign({ videoTemplate: "<video muted autoplay></video>" }, webcam.webcamOptions);
        this.webcam.element.classList.add("shubox-webcam", "shubox-webcam-uninitialized");
    }
    VideoDom.prototype.init = function () {
        this.webcam.element.innerHTML = this.options.videoTemplate || "";
        this.video = this.findOrCreate("video");
        this.video.width = this.webcam.element.offsetWidth;
        this.video.height = this.webcam.element.offsetHeight;
        if (this.options.videoTemplate.indexOf("<select")) {
            this.deviceSelection = new DeviceSelection(this);
        }
    };
    VideoDom.prototype.alreadyStarted = function () {
        return this.webcam.element.classList.contains("shubox-webcam-started");
    };
    VideoDom.prototype.toggleStarted = function () {
        this.webcam.element.classList.remove("shubox-webcam-stopped", "shubox-webcam-captured", "shubox-webcam-uninitialized");
        this.webcam.element.classList.add("shubox-webcam-started", "shubox-webcam-video-started");
    };
    VideoDom.prototype.toggleStopped = function () {
        var _a;
        this.webcam.element.classList.remove("shubox-webcam-started", "shubox-webcam-video-started");
        this.webcam.element.classList.add("shubox-webcam-stopped", "shubox-webcam-uninitialized");
        (_a = this.deviceSelection) === null || _a === void 0 ? void 0 : _a.toggleStopped();
    };
    VideoDom.prototype.finalize = function (videoFile) {
        this.video.src = "";
        this.video.srcObject = null;
        this.video.src = window.URL.createObjectURL(videoFile);
        this.video.controls = true;
        this.video.play();
    };
    VideoDom.prototype.findOrCreate = function (element) {
        var el = this.webcam.element.querySelector(element);
        if (!el) {
            el = document.createElement(element);
            this.webcam.element.appendChild(el);
        }
        return el;
    };
    return VideoDom;
}());
export { VideoDom };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5EO0lBUUUsa0JBQVksTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxZQUNQLEVBQUMsYUFBYSxFQUFFLGdDQUFnQyxFQUFDLEVBQ2pELE1BQU0sQ0FBQyxhQUFhLENBQ3hCLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUMvQixlQUFlLEVBQ2YsNkJBQTZCLENBQzlCLENBQUM7SUFDSixDQUFDO0lBRU0sdUJBQUksR0FBWDtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRXJELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDO0lBRU0saUNBQWMsR0FBckI7UUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU0sZ0NBQWEsR0FBcEI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNsQyx1QkFBdUIsRUFDdkIsd0JBQXdCLEVBQ3hCLDZCQUE2QixDQUM5QixDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDL0IsdUJBQXVCLEVBQ3ZCLDZCQUE2QixDQUM5QixDQUFDO0lBQ0osQ0FBQztJQUVNLGdDQUFhLEdBQXBCOztRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ2xDLHVCQUF1QixFQUN2Qiw2QkFBNkIsQ0FDOUIsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQy9CLHVCQUF1QixFQUN2Qiw2QkFBNkIsQ0FDOUIsQ0FBQztRQUNGLE1BQUEsSUFBSSxDQUFDLGVBQWUsMENBQUUsYUFBYSxHQUFHO0lBQ3hDLENBQUM7SUFFTSwyQkFBUSxHQUFmLFVBQWdCLFNBQVM7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sK0JBQVksR0FBbkIsVUFBb0IsT0FBZTtRQUNqQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEQsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNQLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQztRQUVELE9BQU8sRUFBaUIsQ0FBQztJQUMzQixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUE3RUQsSUE2RUMifQ==