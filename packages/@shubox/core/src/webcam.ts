import Dropzone from "dropzone";
import {IWebcamOptions} from "../index";
import {PhotoDom} from "./webcam/photo_dom";
import {PhotoEvents} from "./webcam/photo_events";
import {VideoDom} from "./webcam/video_dom";
import {VideoEvents} from "./webcam/video_events";

export class Webcam {

  public static stopCamera(callback: () => void = () => {}) {
    document.querySelectorAll(".shubox-video").forEach((video) => {
      ((video as HTMLVideoElement).srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    });

    callback();
  }
  public webcamOptions: IWebcamOptions;
  public dropzone: Dropzone;
  public dom: PhotoDom | VideoDom;
  public events: PhotoEvents | VideoEvents;
  public element: HTMLElement;

  constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions) {
    this.dropzone = dropzone;
    this.webcamOptions = typeof(webcamOptions) === "string" ? { type: webcamOptions } : webcamOptions;
    this.element = element;

    // `this.dom` must be initialized and assigned before events. This is so
    // `events` has access to the initialized `dom` object in the Webcam object
    // passed in.
    this.dom = this.domFactory();
    this.events = this.eventsFactory();
  }

  public domFactory(): PhotoDom | VideoDom {
    return this.webcamOptions.type === "video" ? new VideoDom(this) : new PhotoDom(this);
  }

  public eventsFactory(): PhotoEvents | VideoEvents {
    return this.webcamOptions.type === "video" ? new VideoEvents(this) : new PhotoEvents(this);
  }
}
