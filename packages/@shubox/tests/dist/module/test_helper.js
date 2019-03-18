import * as jsdom from "jsdom/lib/old-api.js";
function setupJsDom(onInit) {
    jsdom.env({
        done: function (err, window) {
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
        html: "\n      <!DOCTYPE html>\n      <html>\n        <head></head>\n        <body>\n          <div id=\"main\">\n            <div class=\"upload upload1\"></div>\n            <div class=\"upload upload2\"></div>\n          </div>\n        </body>\n      </html>\n    ",
    });
}
function teardownJsDom() {
    delete global.window;
    delete global.document;
}
export { setupJsDom, teardownJsDom };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL3Rlc3RfaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sc0JBQXNCLENBQUM7QUFPOUMsU0FBUyxVQUFVLENBQUMsTUFBTztJQUN6QixLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ1IsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU07WUFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBRWxDLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxDQUFDO2FBQ1Y7UUFDSCxDQUFDO1FBQ0QsUUFBUSxFQUFFO1lBQ1Isc0JBQXNCLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEMsY0FBYyxFQUFFLEtBQUs7WUFDckIsd0JBQXdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDcEMsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxJQUFJLEVBQUUsdVFBV0w7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxhQUFhO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNyQixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDekIsQ0FBQztBQUVELE9BQU8sRUFBQyxVQUFVLEVBQUUsYUFBYSxFQUFDLENBQUMifQ==