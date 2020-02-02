import Dropzone from "dropzone";
import {IWebcamOptions} from "../index";

export class ShuboxWebcam {

  public static stopVideo(callback: () => void = () => {}) {
    document.querySelectorAll(".shubox-video").forEach((video) => {
      ((video as HTMLVideoElement).srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    });

    callback();
  }

  private readonly photoConstraints = { video: true };

  private element: HTMLElement;
  private dropzone: Dropzone;
  private webcamOptions: string | IWebcamOptions;
  private image: HTMLImageElement   = document.createElement("img");
  private canvas: HTMLCanvasElement = document.createElement("canvas");
  private video: HTMLVideoElement   = document.createElement("video");

  constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions) {
    this.element = element;
    this.dropzone = dropzone;
    this.webcamOptions = webcamOptions;
  }

  public init() {
    this.video.classList.add("shubox-video");
    this.element.classList.add("shubox-webcam");
    this.element.classList.add("shubox-webcam-uninitialized");
    this.wireUpElements();
  }

  private wireUpElements = () => {
    this.element.addEventListener("click", this.startCamera);

    if (typeof(this.webcamOptions) === "string") { return; }

    if (this.webcamOptions.startCamera) {
      document.querySelector(this.webcamOptions.startCamera)!.addEventListener("click", this.startCamera);
    }

    if (this.webcamOptions.stopCamera) {
      document.querySelector(this.webcamOptions.stopCamera)!.addEventListener("click", this.stopVideo);
    }

    if (this.webcamOptions.startCapture) {
      document.querySelector(this.webcamOptions.startCapture)!.addEventListener("click", this.startCapture);
    }
  }

  private startCamera = (event: Event) => {
    event.preventDefault();

    const el: HTMLElement = this.element;
    if (el.classList.contains("shubox-webcam-started")) { return; }

    const dzPreview: HTMLElement | null = el.querySelector(".dz-preview");
    if (dzPreview) { dzPreview!.remove(); }

    el.classList.remove("shubox-webcam-stopped");
    el.classList.remove("shubox-webcam-captured");
    el.classList.remove("shubox-webcam-uninitialized");
    el.classList.add("shubox-webcam-started");

    this.image.style.display = "none";
    this.canvas.style.display = "none";
    this.video.autoplay = true;
    this.video.width = this.image.width = el.offsetWidth;
    this.video.height = this.image.height = el.offsetHeight;

    this.element.removeEventListener("click", this.startCamera);
    this.video.addEventListener("click", this.startCapture);

    navigator
    .mediaDevices
    .getUserMedia(this.photoConstraints)
    .then((stream) => { this.video.srcObject = stream; })
    .catch(() => {});

    el.appendChild(this.video);
    el.appendChild(this.canvas);
    el.appendChild(this.image);
  }

  private stopVideo = (event: Event) => {
    event.preventDefault();

    const src = (this.video.srcObject as MediaStream);

    if (src) {
      src.getTracks().forEach((track) => {
        track.stop();
      });
    }

    this.element.classList.add("shubox-webcam-stopped");
    this.element.classList.remove("shubox-webcam-started");
  }

  private startCapture = (event: Event) => {
    event.preventDefault();

    if (!this.element.classList.contains("shubox-webcam-started")) { return; }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext("2d")!.drawImage(this.video, 0, 0);
    this.canvas.toBlob((blob: Blob) => {
      const file: any = blob || new Blob();
      const dateTime = (new Date()).toISOString();
      file.name = `webcam-${dateTime}.png`;
      this.dropzone.addFile(file);
    });
    this.image.src = this.canvas.toDataURL("image/png");
    this.image.style.display = "inline";

    this.stopVideo(event);

    if (!!this.video.parentElement) {
      this.video.parentElement!.removeChild(this.canvas);
      this.video.parentElement!.removeChild(this.video);
    }

    this.element.classList.add("shubox-webcam-captured");
    this.element.classList.add("shubox-webcam-stopped");
    this.element.classList.remove("shubox-webcam-started");
  }
}
