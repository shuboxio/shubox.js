import { Webcam } from "../webcam";

export class VideoEvents {
  public webcam: Webcam;
  public recordedBlobs: Blob[] = [];
  public mediaRecorder: MediaRecorder | null = null;
  public alreadyStopped: boolean = false;

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
    this.webcam.dom.video.addEventListener("click", this.startRecording);

    constraints = {
      audio: {
        ... { echoCancellation: { exact: true } },
        ...constraints.audio,
      },
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
      .then((stream) => { this.webcam.dom.video.srcObject = stream; })
      .catch(() => { });

    this.webcam.dom.toggleStarted();
    this.webcam.webcamOptions.cameraStarted?.call(this, this.webcam);
  }

  public stopCamera = (event?: Event) => {
    event?.preventDefault();

    this._stopTracks();
    this.webcam.element.addEventListener("click", this.startCamera);
    this.webcam.dom.toggleStopped();
    this.webcam.webcamOptions.cameraStopped?.call(this, this.webcam);
  }

  public startRecording = (event?: Event) => {
    event?.preventDefault();
    if (!this.webcam.dom.video?.srcObject) { return; }
    if (typeof MediaRecorder === "undefined" && this.isSafari()) {
      window.console!.warn(
        `WARNING: Your web browser, Safari, does not have MediaRecorder enabled.
         You may enable it in the application menu under:
         Develop > Experimental Features > MediaRecorder`,
      );
      return;
    }

    this.recordedBlobs = [];
    this.mediaRecorder = new MediaRecorder(
      this.webcam.dom.video?.srcObject as MediaStream,
      this.mediaRecorderOptions(),
    );

    this.mediaRecorder.ondataavailable = this.videoDataAvailable;
    this.mediaRecorder.onstop = this.recordingStopped;
    this.mediaRecorder.start(10);

    if (this.webcam.webcamOptions.timeLimit) {
      const timeout = this.webcam.webcamOptions.timeLimit * 1000;
      setTimeout(this.stopRecording, timeout);
    }

    this.webcam.dom.video.removeEventListener("click", this.startRecording);
    this.webcam.dom.video.addEventListener("click", this.stopRecording);
    this.webcam.dom.recordingStarted();
    this.webcam.webcamOptions.recordingStarted?.call(this, this.webcam);
  }

  public stopRecording = (event?: Event) => {
    event?.preventDefault();
    if (!this.mediaRecorder || this.mediaRecorder.state !== "recording" || this.alreadyStopped) { return; }

    this._stopTracks();
    this.mediaRecorder.stop();
  }

  public _stopTracks = () => {
    const src = (this.webcam.dom.video?.srcObject as MediaStream);
    src?.getTracks().forEach((track) => { track?.stop(); });
  }

  public recordingStopped = (event?: Event) => {
    event?.preventDefault();

    const extension = this.isSafari() ? "mp4" : "webm";
    const file: any = new Blob(this.recordedBlobs, { type: `video/${extension}` });
    const dateTime = (new Date()).toISOString();
    file.name = `webcam-video-${dateTime}.${extension}`;
    this.webcam.dom.video.removeEventListener("click", this.stopRecording);
    this.webcam.dropzone.addFile(file);
    this.webcam.dom.finalize(file as Blob);
    this.webcam.webcamOptions.recordingStopped?.call(this, this.webcam, file);
  }

  public wireUpSelectorsAndEvents() {
    this.webcam.element.addEventListener("click", this.startCamera);
    this.wireUp(this.webcam.webcamOptions.startCamera, this.startCamera);
    this.wireUp(this.webcam.webcamOptions.stopCamera, this.stopCamera);
    this.wireUp(this.webcam.webcamOptions.startRecording, this.startRecording);
    this.wireUp(this.webcam.webcamOptions.stopRecording, this.stopRecording);
  }

  public wireUp(eventName: string, eventCallback: EventListener, selector?: string) {
    try {
      const el = document.querySelector(selector || eventName);
      el?.addEventListener("click", eventCallback)
    } catch (error) {
      if (!(error instanceof DOMException)) { throw error; }
    }
  }

  public videoDataAvailable = (event: BlobEvent) => {
    if (event?.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  public mediaRecorderOptions = (): object => {
    let mimeType = "";

    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
      mimeType = "video/webm;codecs=vp9,opus";

    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
      mimeType = "video/webm;codecs=vp8,opus";

    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";

    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      mimeType = "video/webm;codecs=vp8";

    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";

    } else if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a")) {
      mimeType = "video/mp4;codecs=avc1,mp4a";
    }

    return { mimeType };
  }

  public isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("safari/") > -1 && ua.indexOf("chrome/") < 0;
  }
}
