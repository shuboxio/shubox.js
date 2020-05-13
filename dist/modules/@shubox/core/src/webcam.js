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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViY2FtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy93ZWJjYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRWxEO0lBaUJFLGdCQUFZLFFBQWtCLEVBQUUsT0FBb0IsRUFBRSxhQUFzQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDbEcsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsd0VBQXdFO1FBQ3hFLDJFQUEyRTtRQUMzRSxhQUFhO1FBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQXpCYSxpQkFBVSxHQUF4QixVQUF5QixRQUErQjtRQUEvQix5QkFBQSxFQUFBLHlCQUE4QixDQUFDO1FBQ3RELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1lBQ3JELEtBQTBCLENBQUMsU0FBeUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2dCQUMvRSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxFQUFFLENBQUM7SUFDYixDQUFDO0lBbUJNLDJCQUFVLEdBQWpCO1FBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRU0sOEJBQWEsR0FBcEI7UUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQyJ9