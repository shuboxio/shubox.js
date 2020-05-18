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
var PhotoDom = /** @class */ (function () {
    function PhotoDom(webcam) {
        this.webcam = webcam;
        this.options = __assign({
            photoTemplate: "\n        <video class=\"shubox-video\" muted autoplay></video>\n        <canvas style=\"display: none\"></canvas>\n        <img style=\"display: none\">\n        ",
        }, webcam.webcamOptions);
        this.webcam.element.classList.add("shubox-webcam", "shubox-webcam-uninitialized");
    }
    PhotoDom.prototype.init = function () {
        this.webcam.element.innerHTML = this.options.photoTemplate || "";
        this.video = this.findOrCreate("video");
        this.canvas = this.findOrCreate("canvas");
        this.image = this.findOrCreate("img");
        this.video.width = this.image.width = this.canvas.width = this.webcam.element.offsetWidth;
        this.video.height = this.image.height = this.canvas.height = this.webcam.element.offsetHeight;
    };
    PhotoDom.prototype.toggleStarted = function () {
        this.webcam.element.classList.remove("shubox-webcam-stopped", "shubox-webcam-captured", "shubox-webcam-uninitialized");
        this.webcam.element.classList.add("shubox-webcam-started");
    };
    PhotoDom.prototype.toggleStopped = function () {
        this.webcam.element.classList.remove("shubox-webcam-started");
        this.webcam.element.classList.add("shubox-webcam-stopped", "shubox-webcam-uninitialized");
    };
    PhotoDom.prototype.findOrCreate = function (element) {
        var el = this.webcam.element.querySelector(element);
        if (!el) {
            el = document.createElement(element);
            this.webcam.element.appendChild(el);
        }
        return el;
    };
    PhotoDom.prototype.alreadyStarted = function () {
        return this.webcam.element.classList.contains("shubox-webcam-started");
    };
    PhotoDom.prototype.recordingStarted = function () {
        // no-op
    };
    PhotoDom.prototype.finalize = function (_) {
        this.image.src = this.canvas.toDataURL("image/png");
        this.image.style.display = "inline";
        this.webcam.element.removeChild(this.canvas);
        this.webcam.element.removeChild(this.video);
        this.webcam.element.classList.add("shubox-webcam-captured", "shubox-webcam-stopped");
        this.webcam.element.classList.remove("shubox-webcam-started");
    };
    return PhotoDom;
}());
export { PhotoDom };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9fZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0vcGhvdG9fZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7SUFPRSxrQkFBWSxNQUFjO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLFlBQ1A7WUFDRCxhQUFhLEVBQUUscUtBSWQ7U0FDRixFQUNFLE1BQU0sQ0FBQyxhQUFhLENBQ3hCLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUMvQixlQUFlLEVBQ2YsNkJBQTZCLENBQzlCLENBQUM7SUFDSixDQUFDO0lBRU0sdUJBQUksR0FBWDtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFzQixDQUFDO1FBQy9ELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQXFCLENBQUM7UUFDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzFGLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUNoRyxDQUFDO0lBRU0sZ0NBQWEsR0FBcEI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNsQyx1QkFBdUIsRUFDdkIsd0JBQXdCLEVBQ3hCLDZCQUE2QixDQUM5QixDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDL0IsdUJBQXVCLENBQ3hCLENBQUM7SUFDSixDQUFDO0lBRU0sZ0NBQWEsR0FBcEI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDL0IsdUJBQXVCLEVBQ3ZCLDZCQUE2QixDQUM5QixDQUFDO0lBQ0osQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLE9BQWU7UUFDakMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDckM7UUFFRCxPQUFPLEVBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUVNLGlDQUFjLEdBQXJCO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVNLG1DQUFnQixHQUF2QjtRQUNFLFFBQVE7SUFDVixDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFnQixDQUFPO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQy9CLHdCQUF3QixFQUN4Qix1QkFBdUIsQ0FDeEIsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFuRkQsSUFtRkMifQ==