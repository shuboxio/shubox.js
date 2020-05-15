var DeviceSelection = /** @class */ (function () {
    function DeviceSelection(dom) {
        var _this = this;
        this.gotDevices = function (deviceInfos) {
            deviceInfos.forEach(function (deviceInfo) {
                var _a, _b, _c;
                var option = document.createElement("option");
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === "audioinput") {
                    option.text = deviceInfo.label || "microphone " + ((_this.audioInSelect || []).length + 1);
                    (_a = _this.audioInSelect) === null || _a === void 0 ? void 0 : _a.appendChild(option);
                }
                else if (deviceInfo.kind === "audiooutput") {
                    option.text = deviceInfo.label || "speaker " + ((_this.audioOutSelect || []).length + 1);
                    (_b = _this.audioOutSelect) === null || _b === void 0 ? void 0 : _b.appendChild(option);
                }
                else if (deviceInfo.kind === "videoinput") {
                    option.text = deviceInfo.label || "camera " + ((_this.videoInSelect || []).length + 1);
                    (_c = _this.videoInSelect) === null || _c === void 0 ? void 0 : _c.appendChild(option);
                }
            });
        };
        this.dom = dom;
        this.audioInSelect = dom
            .webcam
            .element
            .querySelector("select.shubox-audioinput");
        this.audioOutSelect = dom
            .webcam
            .element
            .querySelector("select.shubox-audiooutput");
        this.videoInSelect = dom
            .webcam
            .element
            .querySelector("select.shubox-videoinput");
        this.populateSelects();
    }
    DeviceSelection.prototype.toggleStopped = function () {
        if (this.audioInSelect) {
            this.dom.webcam.element.removeChild(this.audioInSelect);
        }
        if (this.audioOutSelect) {
            this.dom.webcam.element.removeChild(this.audioOutSelect);
        }
        if (this.videoInSelect) {
            this.dom.webcam.element.removeChild(this.videoInSelect);
        }
    };
    DeviceSelection.prototype.populateSelects = function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2aWNlX3NlbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzaHVib3gvY29yZS9zcmMvd2ViY2FtL2RldmljZV9zZWxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7SUFNRSx5QkFBWSxHQUFhO1FBQXpCLGlCQW1CQztRQWdCTyxlQUFVLEdBQUcsVUFBQyxXQUE4QjtZQUNsRCxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTs7Z0JBQzdCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQztnQkFFbkMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtvQkFDcEMsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLGlCQUFjLENBQUMsS0FBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFFLENBQUM7b0JBQ3hGLE1BQUEsS0FBSSxDQUFDLGFBQWEsMENBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRTtpQkFFekM7cUJBQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtvQkFDNUMsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLGNBQVcsQ0FBQyxLQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUUsQ0FBQztvQkFDdEYsTUFBQSxLQUFJLENBQUMsY0FBYywwQ0FBRSxXQUFXLENBQUMsTUFBTSxFQUFFO2lCQUUxQztxQkFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO29CQUMzQyxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLElBQUksYUFBVSxDQUFDLEtBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBRSxDQUFDO29CQUNwRixNQUFBLEtBQUksQ0FBQyxhQUFhLDBDQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUU7aUJBQ3pDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUE7UUFwREMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFZixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUc7YUFDdkIsTUFBTTthQUNOLE9BQU87YUFDUCxhQUFhLENBQUMsMEJBQTBCLENBQWtDLENBQUM7UUFFNUUsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHO2FBQ3hCLE1BQU07YUFDTixPQUFPO2FBQ1AsYUFBYSxDQUFDLDJCQUEyQixDQUFrQyxDQUFDO1FBRTdFLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRzthQUN2QixNQUFNO2FBQ04sT0FBTzthQUNQLGFBQWEsQ0FBQywwQkFBMEIsQ0FBa0MsQ0FBQztRQUU1RSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLHVDQUFhLEdBQXBCO1FBQ0UsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FBRTtRQUNwRixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUFFO1FBQ3RGLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQUU7SUFDdEYsQ0FBQztJQUVPLHlDQUFlLEdBQXZCO1FBQ0UsU0FBUzthQUNSLFlBQVk7YUFDWixnQkFBZ0IsRUFBRTthQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFzQk8scUNBQVcsR0FBbkIsVUFBb0IsS0FBWTtRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFoRUQsSUFnRUMifQ==