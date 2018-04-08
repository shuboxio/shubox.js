"use strict";
exports.__esModule = true;
function fetchSetup(window) {
    if (!window.fetch) {
        var fetchJs = document.createElement('script');
        fetchJs.src =
            'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js';
        fetchJs.id = 'fetch_script';
        document.head.appendChild(fetchJs);
    }
}
exports.fetchSetup = fetchSetup;
