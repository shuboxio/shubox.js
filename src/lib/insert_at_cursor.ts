declare var document: any;

export function insertAtCursor(el: HTMLInputElement, myValue: string): void {
  if (document.selection) {
    el.focus();
    let sel = document.selection.createRange();
    sel.text = myValue;
  } else if (window.navigator.userAgent.indexOf('Edge') > -1) {
    let startPos = el.selectionStart;
    let endPos = el.selectionEnd;
    let pos = startPos + myValue.length;

    el.value =
      el.value.substring(0, startPos) +
      myValue +
      el.value.substring(endPos, el.value.length);

    el.focus();
    el.setSelectionRange(pos, pos);
  } else if (el.selectionStart || el.selectionStart == 0) {
    var startPos = el.selectionStart;
    var endPos = el.selectionEnd;
    el.value =
      el.value.substring(0, startPos) +
      myValue +
      el.value.substring(endPos, el.value.length);
  } else {
    el.value += myValue;
  }
}
