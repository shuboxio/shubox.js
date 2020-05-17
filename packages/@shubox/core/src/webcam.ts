import Dropzone from "dropzone";
import {DeviceSelection} from "./webcam/device_selection";
import {PhotoDom} from "./webcam/photo_dom";
import {PhotoEvents} from "./webcam/photo_events";
import {VideoDom} from "./webcam/video_dom";
import {VideoEvents} from "./webcam/video_events";

export interface IWebcamOptions {
  type: string;
  startCamera?: string;
  stopCamera?: string;
  startCapture?: string;
  takePhoto?: string;
  startRecording ?: string;
  stopRecording ?: string;
  photoTemplate?: string;
  videoTemplate?: string;
  audioInput?: string;
  videoInput?: string;
  cameraStarted?: (webcam: Webcam) => void;
  cameraStopped?: (webcam: Webcam) => void;
  photoTaken?: (webcam: Webcam, file: Blob) => void;
  recordingStarted?: (webcam: Webcam) => void;
  recordingStopped?: (webcam: Webcam, file: Blob) => void;
}

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
  public deviceSelection: DeviceSelection;

  constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions) {
    this.dropzone = dropzone;
    this.webcamOptions = typeof(webcamOptions) === "string" ? { type: webcamOptions } : webcamOptions;
    this.element = element;

    // `this.dom` must be initialized and assigned before events. This is so
    // `events` has access to the initialized `dom` object in the Webcam object
    // passed in.
    this.dom = this.domFactory();
    this.events = this.eventsFactory();
    this.deviceSelection = new DeviceSelection(this.events, this.webcamOptions);
  }

  public domFactory(): PhotoDom | VideoDom {
    return this.webcamOptions.type === "video" ? new VideoDom(this) : new PhotoDom(this);
  }

  public eventsFactory(): PhotoEvents | VideoEvents {
    return this.webcamOptions.type === "video" ? new VideoEvents(this) : new PhotoEvents(this);
  }
}
