import { JSDOM } from "jsdom";

function setupJsDom(onInit?: any) {
  const dom = new JSDOM(`
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
    {
      url: "http://localhost",
      runScripts: "dangerously",
      resources: "usable"
    }
  )
  if (onInit) { dom.window.onload = onInit }
}

function teardownJsDom() {
  // @ts-ignore
  global.window.close();
}

export { setupJsDom, teardownJsDom };
