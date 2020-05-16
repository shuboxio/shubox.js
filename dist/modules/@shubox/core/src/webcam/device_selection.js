var DeviceSelection = /** @class */ (function () {
    function DeviceSelection(dom) {
        var _this = this;
        var _a, _b;
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
            _this.dom.webcam.events.stopCamera(event);
            _this.dom.webcam.events.startCamera(event, {
                audio: {
                    deviceId: ((_a = _this.audioinput) === null || _a === void 0 ? void 0 : _a.value) ? { exact: (_b = _this.audioinput) === null || _b === void 0 ? void 0 : _b.value } : undefined,
                },
            });
        };
        this.updateVideoIn = function (event) {
            var _a, _b;
            _this.dom.webcam.events.stopCamera(event);
            _this.dom.webcam.events.startCamera(event, {
                video: {
                    deviceId: ((_a = _this.videoinput) === null || _a === void 0 ? void 0 : _a.value) ? { exact: (_b = _this.videoinput) === null || _b === void 0 ? void 0 : _b.value } : undefined,
                },
            });
        };
        this.dom = dom;
        this.audioinput = document.querySelector("select.shubox-audioinput");
        this.videoinput = document.querySelector("select.shubox-videoinput");
        (_a = this.audioinput) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.updateAudioIn);
        (_b = this.videoinput) === null || _b === void 0 ? void 0 : _b.addEventListener("change", this.updateVideoIn);
        this.populateSelects();
    }
    DeviceSelection.prototype.populateSelects = function () {
        if (!this.audioinput && !this.videoinput) {
            return;
        }
        navigator
            .mediaDevices
            .enumerateDevices()
            .then(this.gotDevices)
            .catch(this.handleError);
    };
    DeviceSelection.prototype.handleError = function (error) {
        console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
    };
    return DeviceSelection;
}());
export { DeviceSelection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlX3NlbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvd2ViY2FtL2RldmljZV9zZWxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7SUFLRSx5QkFBWSxHQUFhO1FBQXpCLGlCQU9DOztRQVlPLGVBQVUsR0FBRyxVQUFDLFdBQThCO1lBQ2xELFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVOztnQkFDN0IsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO2dCQUNuQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFFO29CQUNyQyxPQUFPO2lCQUNSO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLEtBQUssSUFBSSxpQkFBYyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDO29CQUMzRixNQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLDBDQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUU7aUJBQzVDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFNTyxrQkFBYSxHQUFHLFVBQUMsS0FBWTs7WUFDbkMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV6QyxLQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDeEMsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxPQUFBLEtBQUksQ0FBQyxVQUFVLDBDQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxLQUFLLFFBQUUsS0FBSSxDQUFDLFVBQVUsMENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQy9FO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO1FBRU8sa0JBQWEsR0FBRyxVQUFDLEtBQVk7O1lBQ25DLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFekMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hDLEtBQUssRUFBRTtvQkFDTCxRQUFRLEVBQUUsT0FBQSxLQUFJLENBQUMsVUFBVSwwQ0FBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUMsS0FBSyxRQUFFLEtBQUksQ0FBQyxVQUFVLDBDQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUMvRTthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQTtRQXJEQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBa0MsQ0FBQztRQUN0RyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQWtDLENBQUM7UUFDdEcsTUFBQSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNoRSxNQUFBLElBQUksQ0FBQyxVQUFVLDBDQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ2hFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU8seUNBQWUsR0FBdkI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFFckQsU0FBUzthQUNSLFlBQVk7YUFDWixnQkFBZ0IsRUFBRTthQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFlTyxxQ0FBVyxHQUFuQixVQUFvQixLQUFZO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQTZDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQXFCSCxzQkFBQztBQUFELENBQUMsQUE1REQsSUE0REMifQ==