interface BrowserWindow {
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  Dropzone?: () => boolean;
}

export function fetchSetup(window: BrowserWindow) {
  if (!window.fetch) {
    let fetchJs = document.createElement('script');
    fetchJs.src =
      'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js';
    fetchJs.id = 'fetch_script';
    document.head.appendChild(fetchJs);
  }
}
