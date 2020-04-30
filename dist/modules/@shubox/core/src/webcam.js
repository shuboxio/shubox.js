import { PhotoDom } from "./webcam/photo_dom";
import { PhotoEvents } from "./webcam/photo_events";
import { VideoDom } from "./webcam/video_dom";
import { VideoEvents } from "./webcam/video_events";
var Webcam = /** @class */ (function () {
    function Webcam(dropzone, element, webcamOptions) {
        this.dropzone = dropzone;
        this.webcamOptions = typeof (webcamOptions) === "string" ? { type: webcamOptions } : webcamOptions,
            this.element = element;
        // `this.dom` must be initialized and assigned before events. This is so
        // `events` has access to the initialized `dom` object in the Webcam object
        // passed in.
        this.dom = this.domFactory();
        this.events = this.eventsFactory();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViY2FtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRWxEO0lBaUJFLGdCQUFZLFFBQWtCLEVBQUUsT0FBb0IsRUFBRSxhQUFzQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhO1lBQ2pHLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLHdFQUF3RTtRQUN4RSwyRUFBMkU7UUFDM0UsYUFBYTtRQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUF6QmEsaUJBQVUsR0FBeEIsVUFBeUIsUUFBK0I7UUFBL0IseUJBQUEsRUFBQSx5QkFBOEIsQ0FBQztRQUN0RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNyRCxLQUEwQixDQUFDLFNBQXlCLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztnQkFDL0UsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsRUFBRSxDQUFDO0lBQ2IsQ0FBQztJQW1CTSwyQkFBVSxHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVNLDhCQUFhLEdBQXBCO1FBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBQ0gsYUFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0MifQ==