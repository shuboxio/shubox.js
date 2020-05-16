import {VideoDom} from "./video_dom";

export class DeviceSelection {
  public dom: VideoDom;
  public audioinput?: HTMLSelectElement;
  public videoinput?: HTMLSelectElement;

  constructor(dom: VideoDom) {
    this.dom = dom;
    this.audioinput = document.querySelector("select.shubox-audioinput") as HTMLSelectElement | undefined;
    this.videoinput = document.querySelector("select.shubox-videoinput") as HTMLSelectElement | undefined;
    this.audioinput?.addEventListener("change", this.updateAudioIn);
    this.videoinput?.addEventListener("change", this.updateVideoIn);
    this.populateSelects();
  }

  private populateSelects() {
    if (!this.audioinput && !this.videoinput) { return; }

    navigator
    .mediaDevices
    .enumerateDevices()
    .then(this.gotDevices)
    .catch(this.handleError);
  }

  private gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
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

  private handleError(error: Error) {
    console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
  }

  private updateAudioIn = (event: Event) => {
    this.dom.webcam.events.stopCamera(event);

    this.dom.webcam.events.startCamera(event, {
      audio: {
        deviceId: this.audioinput?.value ? {exact: this.audioinput?.value} : undefined,
      },
    });
  }

  private updateVideoIn = (event: Event) => {
    this.dom.webcam.events.stopCamera(event);

    this.dom.webcam.events.startCamera(event, {
      video: {
        deviceId: this.videoinput?.value ? {exact: this.videoinput?.value} : undefined,
      },
    });
  }
}
