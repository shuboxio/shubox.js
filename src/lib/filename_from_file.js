"use strict";
exports.__esModule = true;
function filenameFromFile(file, date) {
    if (!file.name) {
        var now = date || new Date();
        // date
        var daynum = now.getDate();
        var day = daynum < 10 ? "0" + daynum : String(daynum);
        var monthnum = now.getMonth() + 1;
        var month = monthnum < 10 ? "0" + monthnum : String(monthnum);
        var year = now.getFullYear();
        // time
        var hour = now.getHours();
        var minutenum = now.getMinutes();
        var minute = minutenum < 10 ? "0" + minutenum : String(minutenum);
        var secondnum = now.getSeconds();
        var second = secondnum < 10 ? "0" + secondnum : String(secondnum);
        var datetime = day + "." + month + "." + year + "-" + hour + "." + minute + "." + second;
        file.name = "paste-" + datetime + ".jpg";
    }
    return file.name;
}
exports.filenameFromFile = filenameFromFile;
