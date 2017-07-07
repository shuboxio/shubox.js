(function (exports) {
'use strict';

function fetchSetup(window) {
    if (!window.fetch) {
        var fetchJs = document.createElement('script');
        fetchJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js';
        fetchJs.id = 'fetch_script';
        document.head.appendChild(fetchJs);
    }
    if (!window.Dropzone) {
        var dropzoneJs = document.createElement('script');
        dropzoneJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.1.0/min/dropzone.min.js';
        dropzoneJs.id = 'dropzone_script';
        document.head.appendChild(dropzoneJs);
    }
}

var Shubox = (function () {
    function Shubox(selector) {
        this.selector = selector;
        fetchSetup(window);
    }
    return Shubox;
}());

exports.Shubox = Shubox;

}((this.shu = this.shu || {})));
var Shubox = shu.Shubox;