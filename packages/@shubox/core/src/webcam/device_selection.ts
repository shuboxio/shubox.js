import {IWebcamOptions} from "../webcam";
import {PhotoEvents} from "./photo_events";
import {VideoEvents} from "./video_events";

export class DeviceSelection {
  public events: VideoEvents | PhotoEvents;
  public webcamOptions: IWebcamOptions;
  public audioinput?: HTMLSelectElement;
  public videoinput?: HTMLSelectElement;
  public initialized: boolean = false;

  constructor(events: VideoEvents | PhotoEvents, webcamOptions: IWebcamOptions) {
    this.events = events;
    this.webcamOptions = webcamOptions;
    this.audioinput = document.querySelector(webcamOptions.audioInput as string) as HTMLSelectElement | undefined;
    this.videoinput = document.querySelector(webcamOptions.videoInput as string) as HTMLSelectElement | undefined;
    this.audioinput?.addEventListener("change", this.updateAudioIn);
    this.videoinput?.addEventListener("change", this.updateVideoIn);
    this.populateSelects();
    this.initialized = true;
  }

  public populateSelects() {
    if (this.initialized || (!this.audioinput && !this.videoinput)) { return; }

    navigator
    .mediaDevices
    .enumerateDevices()
    .then(this.gotDevices)
    .catch(this.handleError);
  }

  public gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
    deviceInfos.forEach((deviceInfo) => {
      const option = document.createElement("option");
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === "audiooutput") {
        return;
      } else {
        option.text = deviceInfo.label || `microphone ${(this[deviceInfo.kind] || []).length + 1}`;
        this[deviceInfo.kind]?.appendChild(option);
      }
    });
  }

  public handleError(error: Error) {
    window.console!.log(
      "navigator.MediaDevices.getUserMedia error: ", error.message, error.name,
    );
  }

  public updateAudioIn = (event: Event) => {
    this.events.stopCamera(event);

    this.events.startCamera(event, {
      audio: {
        deviceId: this.audioinput?.value ? {exact: this.audioinput?.value} : undefined,
      },
    });
  }

  public updateVideoIn = (event: Event) => {
    this.events.stopCamera(event);

    this.events.startCamera(event, {
      video: {
        deviceId: this.videoinput?.value ? {exact: this.videoinput?.value} : undefined,
      },
    });
  }
}
