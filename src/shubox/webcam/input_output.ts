class InputOutput {
  constructor() {
    navigator.mediaDevices.enumerateDevices().then(this.gotDevices).catch(this.handleError);
  }

  public gotDevices() {
  }

  public handleError() {

  }
}
