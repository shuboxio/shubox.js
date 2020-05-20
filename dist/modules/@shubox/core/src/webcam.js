import { DeviceSelection } from "./webcam/device_selection";
import { PhotoDom } from "./webcam/photo_dom";
import { PhotoEvents } from "./webcam/photo_events";
import { VideoDom } from "./webcam/video_dom";
import { VideoEvents } from "./webcam/video_events";
var Webcam = /** @class */ (function () {
    function Webcam(dropzone, element, webcamOptions) {
        this.dropzone = dropzone;
        this.webcamOptions = typeof (webcamOptions) === "string" ? { type: webcamOptions } : webcamOptions;
        this.element = element;
        // `this.dom` must be initialized and assigned before events. This is so
        // `events` has access to the initialized `dom` object in the Webcam object
        // passed in.
        this.dom = this.domFactory();
        this.events = this.eventsFactory();
        this.deviceSelection = new DeviceSelection(this.events, this.webcamOptions);
    }
    Webcam.stopCamera = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        document.querySelectorAll(".shubox-video").forEach(function (video) {
            video.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
        });
        callback();
    };
    Webcam.prototype.domFactory = function () {
        return this.webcamOptions.type === "video" ? new VideoDom(this) : new PhotoDom(this);
    };
    Webcam.prototype.eventsFactory = function () {
        return this.webcamOptions.type === "video" ? new VideoEvents(this) : new PhotoEvents(this);
    };
    return Webcam;
}());
export { Webcam };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViY2FtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQXNCbEQ7SUFrQkUsZ0JBQVksUUFBa0IsRUFBRSxPQUFvQixFQUFFLGFBQXNDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUNsRyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV2Qix3RUFBd0U7UUFDeEUsMkVBQTJFO1FBQzNFLGFBQWE7UUFDYixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUEzQmEsaUJBQVUsR0FBeEIsVUFBeUIsUUFBK0I7UUFBL0IseUJBQUEsRUFBQSx5QkFBOEIsQ0FBQztRQUN0RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNyRCxLQUEwQixDQUFDLFNBQXlCLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztnQkFDL0UsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQXFCTSwyQkFBVSxHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVNLDhCQUFhLEdBQXBCO1FBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBQ0gsYUFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0MifQ==