import { IWebcamOptions, Webcam } from "../webcam";

export class VideoDom {
  public webcam: Webcam;
  public options: IWebcamOptions;
  public video: HTMLVideoElement;
  public image?: HTMLImageElement;
  public canvas?: HTMLCanvasElement;
  public initialized: boolean = false;

  constructor(webcam: Webcam) {
    this.video = new HTMLVideoElement;
    this.webcam = webcam;
    this.options = {
      ...{ videoTemplate: `<video muted autoplay></video>` },
      ...webcam.webcamOptions,
    };
    this.webcam.element.classList.add(
      "shubox-webcam",
      "shubox-webcam-uninitialized",
    );
  }

  public init(): void {
    if (this.initialized) { return; }
    this.webcam.element.innerHTML = this.options.videoTemplate || "";
    this.video = this.findOrCreate("video") as HTMLVideoElement;
    this.video.width = this.webcam.element.offsetWidth;
    this.video.height = this.webcam.element.offsetHeight;
    this.initialized = true;
  }

  public alreadyStarted(): boolean {
    return this.webcam.element.classList.contains("shubox-webcam-started");
  }

  public toggleStarted(): void {
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

  public toggleStopped(): void {
    this.webcam.element.classList.remove(
      "shubox-webcam-started",
      "shubox-webcam-video-started",
    );
    this.webcam.element.classList.add(
      "shubox-webcam-stopped",
      "shubox-webcam-uninitialized",
    );
  }

  public recordingStarted(): void {
    this.webcam.element.classList.add(
      "shubox-webcam-video-recording",
    );
  }

  public finalize(videoFile: Blob): void {
    this.webcam.element.classList.remove(
      "shubox-webcam-video-recording",
    );
    this.webcam.element.classList.add(
      "shubox-webcam-video-recorded",
    );
    this.video.src = "";
    this.video.srcObject = null;
    this.video.src = window.URL.createObjectURL(videoFile);
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
