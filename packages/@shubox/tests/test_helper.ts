import * as jsdom from "jsdom/lib/old-api.js";

declare const global: {
  window: any;
  document: any;
};

function setupJsDom(onInit?) {
  jsdom.env({
    done: (err, window) => {
      global.window = window;
      global.document = window.document;

      if (onInit) {
        onInit();
      }
    },
    features: {
      FetchExternalResources: ["script"],
      MutationEvents: "2.0",
      ProcessExternalResources: ["script"],
      QuerySelector: false,
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div id="main">
            <div class="upload upload1"></div>
            <div class="upload upload2"></div>
          </div>
        </body>
      </html>
    `,
  });
}

function teardownJsDom() {
  delete global.window;
  delete global.document;
}

export {setupJsDom, teardownJsDom};
