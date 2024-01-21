import { IWebcamOptions, Webcam } from "../webcam";

export class PhotoDom {
  public webcam: Webcam;
  public options: IWebcamOptions;
  public video: HTMLVideoElement;
  public canvas: HTMLCanvasElement;
  public image: HTMLImageElement;

  constructor(webcam: Webcam) {
    this.video = new HTMLVideoElement;
    this.canvas = new HTMLCanvasElement;
    this.image = new HTMLImageElement;
    this.webcam = webcam;
    this.options = {
      ...{
        photoTemplate: `
        <video class="shubox-video" muted autoplay></video>
        <canvas style="display: none"></canvas>
        <img style="display: none">
        `,
      },
      ...webcam.webcamOptions,
    };
    this.webcam.element.classList.add(
      "shubox-webcam",
      "shubox-webcam-uninitialized",
    );
  }

  public init() {
    this.webcam.element.innerHTML = this.options.photoTemplate || "";
    this.video = this.findOrCreate("video") as HTMLVideoElement;
    this.canvas = this.findOrCreate("canvas") as HTMLCanvasElement;
    this.image = this.findOrCreate("img") as HTMLImageElement;
    this.video.width = this.image.width = this.canvas.width = this.webcam.element.offsetWidth;
    this.video.height = this.image.height = this.canvas.height = this.webcam.element.offsetHeight;
  }

  public toggleStarted() {
    this.webcam.element.classList.remove(
      "shubox-webcam-stopped",
      "shubox-webcam-captured",
      "shubox-webcam-uninitialized",
    );
    this.webcam.element.classList.add(
      "shubox-webcam-started",
    );
  }

  public toggleStopped() {
    this.webcam.element.classList.remove("shubox-webcam-started");
    this.webcam.element.classList.add(
      "shubox-webcam-stopped",
      "shubox-webcam-uninitialized",
    );
  }

  public findOrCreate(element: string): HTMLElement {
    let el = this.webcam.element.querySelector(element);

    if (!el) {
      el = document.createElement(element);
      this.webcam.element.appendChild(el);
    }

    return el as HTMLElement;
  }

  public alreadyStarted(): boolean {
    return this.webcam.element.classList.contains("shubox-webcam-started");
  }

  public recordingStarted(): void {
    // no-op
  }

  public finalize(_: Blob): void {
    this.image.src = this.canvas.toDataURL("image/png");
    this.image.style.display = "inline";
    this.webcam.element.removeChild(this.canvas);
    this.webcam.element.removeChild(this.video);
    this.webcam.element.classList.add(
      "shubox-webcam-captured",
      "shubox-webcam-stopped",
    );
    this.webcam.element.classList.remove("shubox-webcam-started");
  }
}
