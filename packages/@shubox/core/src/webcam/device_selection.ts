import {VideoDom} from "./video_dom";

export class DeviceSelection {
  public dom: VideoDom;
  public audioInSelect?: HTMLSelectElement;
  public audioOutSelect?: HTMLSelectElement;
  public videoInSelect?: HTMLSelectElement;

  constructor(dom: VideoDom) {
    this.dom = dom;

    this.audioInSelect = dom
    .webcam
    .element
    .querySelector("select.shubox-audioinput") as HTMLSelectElement | undefined;

    this.audioOutSelect = dom
    .webcam
    .element
    .querySelector("select.shubox-audiooutput") as HTMLSelectElement | undefined;

    this.videoInSelect = dom
    .webcam
    .element
    .querySelector("select.shubox-videoinput") as HTMLSelectElement | undefined;

    this.populateSelects();
  }

  public toggleStopped() {
    if (this.audioInSelect) { this.dom.webcam.element.removeChild(this.audioInSelect); }
    if (this.audioOutSelect) { this.dom.webcam.element.removeChild(this.audioOutSelect); }
    if (this.videoInSelect) { this.dom.webcam.element.removeChild(this.videoInSelect); }
  }

  private populateSelects() {
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

      if (deviceInfo.kind === "audioinput") {
        option.text = deviceInfo.label || `microphone ${(this.audioInSelect || []).length + 1}`;
        this.audioInSelect?.appendChild(option);

      } else if (deviceInfo.kind === "audiooutput") {
        option.text = deviceInfo.label || `speaker ${(this.audioOutSelect || []).length + 1}`;
        this.audioOutSelect?.appendChild(option);

      } else if (deviceInfo.kind === "videoinput") {
        option.text = deviceInfo.label || `camera ${(this.videoInSelect || []).length + 1}`;
        this.videoInSelect?.appendChild(option);
      }
    });
  }

  private handleError(error: Error) {
    console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
  }
}
