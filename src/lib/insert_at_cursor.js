"use strict";
exports.__esModule = true;
function insertAtCursor(el, myValue) {
    if (document.selection) {
        el.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
    }
    else if (window.navigator.userAgent.indexOf('Edge') > -1) {
        var startPos_1 = el.selectionStart;
        var endPos_1 = el.selectionEnd;
        var pos = startPos_1 + myValue.length;
        el.value =
            el.value.substring(0, startPos_1) +
                myValue +
                el.value.substring(endPos_1, el.value.length);
        el.focus();
        el.setSelectionRange(pos, pos);
    }
    else if (el.selectionStart || el.selectionStart == 0) {
        var startPos = el.selectionStart;
        var endPos = el.selectionEnd;
        el.value =
            el.value.substring(0, startPos) +
                myValue +
                el.value.substring(endPos, el.value.length);
    }
    else {
        el.value += myValue;
    }
}
exports.insertAtCursor = insertAtCursor;
