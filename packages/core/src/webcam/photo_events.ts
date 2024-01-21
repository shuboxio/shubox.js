import { Webcam } from "../webcam";

export class PhotoEvents {
  public webcam: Webcam;

  constructor(webcam: Webcam) {
    this.webcam = webcam;
    this.webcam.element.addEventListener("click", this.startCamera);
    this.wireUpSelectorsAndEvents();
  }

  public startCamera = (event?: Event, constraints: any = {}) => {
    event?.preventDefault();
    if (this.webcam.dom.alreadyStarted()) { return; }

    this.webcam.dom.init();
    this.webcam.element.removeEventListener("click", this.startCamera);
    this.webcam.dom.video.addEventListener("click", this.takePhoto);

    constraints = {
      audio: false,
      video: {
        ... {
          height: this.webcam.element.offsetHeight,
          width: this.webcam.element.offsetWidth,
        },
        ...constraints.video,
      },
    };

    navigator
      .mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (!this.webcam.dom.video) { return; }
        this.webcam.dom.video.srcObject = stream;
      })
      .catch(() => { });

    this.webcam.dom.toggleStarted();
    this.webcam.webcamOptions.cameraStarted?.call(this, this.webcam);
  }

  public takePhoto = (event?: Event) => {
    event?.preventDefault();
    if (!this.webcam.dom.alreadyStarted()) { return; }

    let file: any;
    this.webcam.dom.canvas?.getContext("2d")!.drawImage(this.webcam.dom.video, 0, 0);
    this.webcam.dom.canvas?.toBlob((blob: Blob | null) => {
      const dateTime = (new Date()).toISOString();
      file = blob || new Blob();
      file.name = `webcam-${dateTime}.png`;
      this.webcam.dropzone.addFile(file);
    });

    this.webcam.dom.finalize(file as Blob);
    this.webcam.webcamOptions.photoTaken?.call(this, this.webcam, file as Blob);
  }

  public stopCamera = (event?: Event) => {
    event?.preventDefault();
    if (!this.webcam.dom.video) { return; }

    const src = (this.webcam.dom.video.srcObject as MediaStream);
    src?.getTracks().forEach((track) => { track.stop(); });

    this.webcam.element.addEventListener("click", this.startCamera);
    this.webcam.dom.toggleStopped();
    this.webcam.webcamOptions.cameraStopped?.call(this, this.webcam);
  }

  public wireUpSelectorsAndEvents() {
    this.wireUp(this.webcam.webcamOptions.startCamera, this.startCamera);
    this.wireUp(this.webcam.webcamOptions.stopCamera, this.stopCamera);
    this.wireUp(this.webcam.webcamOptions.takePhoto, this.takePhoto);

    if (this.webcam.webcamOptions?.startCapture) {
      window.console!.warn(
        "`startCapture` is being deprecated in favor of `takePhoto`. Use `takePhoto` instead.",
      );
      this.wireUp(
        this.webcam.webcamOptions.takePhoto,
        this.takePhoto,
        this.webcam.webcamOptions.startCapture
      );
    }
  }

  public wireUp(eventName: string, eventCallback: EventListener, selector?: string) {
    try {
      const el = document.querySelector(selector || eventName);
      el?.addEventListener("click", eventCallback);
    } catch (error) {
      if (!(error instanceof DOMException)) { throw error; }
    }
  }
}
