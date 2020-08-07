var DeviceSelection = /** @class */ (function () {
    function DeviceSelection(events, webcamOptions) {
        var _this = this;
        var _a, _b;
        this.initialized = false;
        this.gotDevices = function (deviceInfos) {
            deviceInfos.forEach(function (deviceInfo) {
                var _a;
                var option = document.createElement("option");
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === "audiooutput") {
                    return;
                }
                else {
                    option.text = deviceInfo.label || "microphone " + ((_this[deviceInfo.kind] || []).length + 1);
                    (_a = _this[deviceInfo.kind]) === null || _a === void 0 ? void 0 : _a.appendChild(option);
                }
            });
        };
        this.updateAudioIn = function (event) {
            var _a, _b;
            _this.events.stopCamera(event);
            _this.events.startCamera(event, {
                audio: {
                    deviceId: ((_a = _this.audioinput) === null || _a === void 0 ? void 0 : _a.value) ? { exact: (_b = _this.audioinput) === null || _b === void 0 ? void 0 : _b.value } : undefined,
                },
            });
        };
        this.updateVideoIn = function (event) {
            var _a, _b;
            _this.events.stopCamera(event);
            _this.events.startCamera(event, {
                video: {
                    deviceId: ((_a = _this.videoinput) === null || _a === void 0 ? void 0 : _a.value) ? { exact: (_b = _this.videoinput) === null || _b === void 0 ? void 0 : _b.value } : undefined,
                },
            });
        };
        this.events = events;
        this.webcamOptions = webcamOptions;
        this.audioinput = document.querySelector(webcamOptions.audioInput);
        this.videoinput = document.querySelector(webcamOptions.videoInput);
        (_a = this.audioinput) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.updateAudioIn);
        (_b = this.videoinput) === null || _b === void 0 ? void 0 : _b.addEventListener("change", this.updateVideoIn);
        this.populateSelects();
        this.initialized = true;
    }
    DeviceSelection.prototype.populateSelects = function () {
        if (this.initialized || (!this.audioinput && !this.videoinput)) {
            return;
        }
        navigator
            .mediaDevices
            .enumerateDevices()
            .then(this.gotDevices)
            .catch(this.handleError);
    };
    DeviceSelection.prototype.handleError = function (error) {
        window.console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
    };
    return DeviceSelection;
}());
export { DeviceSelection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlX3NlbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvd2ViY2FtL2RldmljZV9zZWxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7SUFPRSx5QkFBWSxNQUFpQyxFQUFFLGFBQTZCO1FBQTVFLGlCQVNDOztRQVhNLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBdUI3QixlQUFVLEdBQUcsVUFBQyxXQUE4QjtZQUNqRCxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTs7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDbkMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtvQkFDckMsT0FBTztpQkFDUjtxQkFBTTtvQkFDTCxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLElBQUksaUJBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQztvQkFDM0YsTUFBQSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQywwQ0FBRSxXQUFXLENBQUMsTUFBTSxFQUFFO2lCQUM1QztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBUU0sa0JBQWEsR0FBRyxVQUFDLEtBQVk7O1lBQ2xDLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlCLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDN0IsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxPQUFBLEtBQUksQ0FBQyxVQUFVLDBDQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxLQUFLLFFBQUUsS0FBSSxDQUFDLFVBQVUsMENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQy9FO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRU0sa0JBQWEsR0FBRyxVQUFDLEtBQVk7O1lBQ2xDLEtBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlCLEtBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDN0IsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxPQUFBLEtBQUksQ0FBQyxVQUFVLDBDQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxLQUFLLFFBQUUsS0FBSSxDQUFDLFVBQVUsMENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQy9FO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBekRDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsVUFBb0IsQ0FBa0MsQ0FBQztRQUM5RyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQW9CLENBQWtDLENBQUM7UUFDOUcsTUFBQSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNoRSxNQUFBLElBQUksQ0FBQyxVQUFVLDBDQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ2hFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRU0seUNBQWUsR0FBdEI7UUFDRSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFM0UsU0FBUzthQUNSLFlBQVk7YUFDWixnQkFBZ0IsRUFBRTthQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFlTSxxQ0FBVyxHQUFsQixVQUFtQixLQUFZO1FBQzdCLE1BQU0sQ0FBQyxPQUFRLENBQUMsR0FBRyxDQUNqQiw2Q0FBNkMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQ3pFLENBQUM7SUFDSixDQUFDO0lBcUJILHNCQUFDO0FBQUQsQ0FBQyxBQWxFRCxJQWtFQyJ9