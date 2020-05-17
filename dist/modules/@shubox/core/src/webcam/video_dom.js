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
var VideoDom = /** @class */ (function () {
    function VideoDom(webcam) {
        this.initialized = false;
        this.webcam = webcam;
        this.options = __assign({ videoTemplate: "<video muted autoplay></video>" }, webcam.webcamOptions);
        this.webcam.element.classList.add("shubox-webcam", "shubox-webcam-uninitialized");
    }
    VideoDom.prototype.init = function () {
        if (this.initialized) {
            return;
        }
        this.webcam.element.innerHTML = this.options.videoTemplate || "";
        this.video = this.findOrCreate("video");
        this.video.width = this.webcam.element.offsetWidth;
        this.video.height = this.webcam.element.offsetHeight;
        this.initialized = true;
    };
    VideoDom.prototype.alreadyStarted = function () {
        return this.webcam.element.classList.contains("shubox-webcam-started");
    };
    VideoDom.prototype.toggleStarted = function () {
        this.webcam.element.classList.remove("shubox-webcam-stopped", "shubox-webcam-captured", "shubox-webcam-uninitialized");
        this.webcam.element.classList.add("shubox-webcam-started", "shubox-webcam-video-started");
    };
    VideoDom.prototype.toggleStopped = function () {
        this.webcam.element.classList.remove("shubox-webcam-started", "shubox-webcam-video-started");
        this.webcam.element.classList.add("shubox-webcam-stopped", "shubox-webcam-uninitialized");
    };
    VideoDom.prototype.finalize = function (videoFile) {
        this.video.src = "";
        this.video.srcObject = null;
        this.video.src = window.URL.createObjectURL(videoFile);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW9fZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vdmlkZW9fZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFRRSxrQkFBWSxNQUFjO1FBRm5CLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBR2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLFlBQ1AsRUFBQyxhQUFhLEVBQUUsZ0NBQWdDLEVBQUMsRUFDakQsTUFBTSxDQUFDLGFBQWEsQ0FDeEIsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQy9CLGVBQWUsRUFDZiw2QkFBNkIsQ0FDOUIsQ0FBQztJQUNKLENBQUM7SUFFTSx1QkFBSSxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFTSxpQ0FBYyxHQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTSxnQ0FBYSxHQUFwQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ2xDLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsNkJBQTZCLENBQzlCLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUMvQix1QkFBdUIsRUFDdkIsNkJBQTZCLENBQzlCLENBQUM7SUFDSixDQUFDO0lBRU0sZ0NBQWEsR0FBcEI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNsQyx1QkFBdUIsRUFDdkIsNkJBQTZCLENBQzlCLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUMvQix1QkFBdUIsRUFDdkIsNkJBQTZCLENBQzlCLENBQUM7SUFDSixDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFnQixTQUFTO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLE9BQWU7UUFDakMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDckM7UUFFRCxPQUFPLEVBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBeEVELElBd0VDIn0=