import {Webcam} from "../webcam";

export class VideoEvents {
  public webcam: Webcam;
  public recordedBlobs: Blob[] = [];
  public mediaRecorder: MediaRecorder;
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
        ... { echoCancellation: {exact: true} },
        ... constraints.audio,
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
      .catch(() => {});

    this.webcam.dom.toggleStarted();
    this.webcam.webcamOptions.cameraStarted?.call(this, this.webcam);
  }

  public stopCamera = (event?: Event) => {
    event?.preventDefault();

    const src = (this.webcam.dom.video?.srcObject as MediaStream);
    src?.getTracks().forEach((track) => { track?.stop(); });

    this.webcam.element.addEventListener("click", this.startCamera);
    this.webcam.dom.toggleStopped();
    this.webcam.webcamOptions.cameraStopped?.call(this, this.webcam);
  }

  public startRecording = (event?: Event) => {
    event?.preventDefault();

    this.recordedBlobs = [];
    this.mediaRecorder = new MediaRecorder(
      this.webcam.dom.video?.srcObject as MediaStream,
      this.mediaRecorderOptions(),
    );
    this.mediaRecorder.ondataavailable = this.videoDataAvailable;
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
    if (!this.mediaRecorder || this.alreadyStopped) { return; }

    const file: any = new Blob(this.recordedBlobs, {type: "video/webm"});
    const dateTime = (new Date()).toISOString();
    file.name = `webcam-video-${dateTime}.webm`;

    try {
      this.mediaRecorder.stop();
    } catch (_) {
      /* no-op */
    }

    this.alreadyStopped = true;
    this.webcam.dom.video.removeEventListener("click", this.stopRecording);
    this.webcam.webcamOptions.recordingStopped?.call(this, this.webcam, file);
    this.webcam.dropzone.addFile(file);
    this.webcam.dom.finalize(file as Blob);
  }

  public wireUpSelectorsAndEvents() {
    this.webcam.element.addEventListener("click", this.startCamera);
    this.wireUp("startCamera");
    this.wireUp("stopCamera");
    this.wireUp("startRecording");
    this.wireUp("stopRecording");
  }

  public wireUp(eventName: string, selector?: string) {
    try {
      const el = document.querySelector(selector || this.webcam.webcamOptions[eventName]);
      el?.addEventListener("click", (this[eventName]));
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

    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      mimeType = "video/webm;codecs=vp9";

    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      mimeType = "video/webm;codecs=vp8";

    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    }

    return { mimeType };
  }
}
