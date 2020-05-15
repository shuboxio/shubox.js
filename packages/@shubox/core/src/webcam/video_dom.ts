import {IWebcamOptions} from "../../index";
import {Webcam} from "../webcam";
import {DeviceSelection} from "./device_selection";

export class VideoDom {
  public webcam: Webcam;
  public options: IWebcamOptions;
  public video: HTMLVideoElement;
  public image?: HTMLImageElement;
  public canvas?: HTMLCanvasElement;
  public deviceSelection?: DeviceSelection;

  constructor(webcam: Webcam) {
    this.webcam = webcam;
    this.options = {
      ...{videoTemplate: `<video muted autoplay></video>`},
      ...webcam.webcamOptions,
    };
    this.webcam.element.classList.add(
      "shubox-webcam",
      "shubox-webcam-uninitialized",
    );
  }

  public init() {
    this.webcam.element.innerHTML = this.options.videoTemplate || "";
    this.video = this.findOrCreate("video") as HTMLVideoElement;
    this.video.width = this.webcam.element.offsetWidth;
    this.video.height = this.webcam.element.offsetHeight;

    if (this.options.videoTemplate!.indexOf("<select")) {
      this.deviceSelection = new DeviceSelection(this);
    }
  }

  public alreadyStarted(): boolean {
    return this.webcam.element.classList.contains("shubox-webcam-started");
  }

  public toggleStarted() {
    this.webcam.element.classList.remove(
      "shubox-webcam-stopped",
      "shubox-webcam-captured",
      "shubox-webcam-uninitialized",
    );
    this.webcam.element.classList.add(
      "shubox-webcam-started",
      "shubox-webcam-video-started",
    );
  }

  public toggleStopped() {
    this.webcam.element.classList.remove(
      "shubox-webcam-started",
      "shubox-webcam-video-started",
    );
    this.webcam.element.classList.add(
      "shubox-webcam-stopped",
      "shubox-webcam-uninitialized",
    );
    this.deviceSelection?.toggleStopped();
  }

  public finalize(videoFile) {
    this.video.src = "";
    this.video.srcObject = null;
    this.video.src = window.URL.createObjectURL(videoFile);
    this.video.controls = true;
    this.video.play();
  }

  public findOrCreate(element: string): HTMLElement {
    let el = this.webcam.element.querySelector(element);

    if (!el) {
      el = document.createElement(element);
      this.webcam.element.appendChild(el);
    }

    return el as HTMLElement;
  }
}
