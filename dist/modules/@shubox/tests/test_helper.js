import * as jsdom from 'jsdom/lib/old-api.js';
function setupJsDom(onInit) {
    jsdom.env({
        html: "\n      <!DOCTYPE html>\n      <html>\n        <head></head>\n        <body>\n          <div id=\"main\">\n            <div class=\"upload upload1\"></div>\n            <div class=\"upload upload2\"></div>\n          </div>\n        </body>\n      </html>\n    ",
        features: {
            FetchExternalResources: ['script'],
            ProcessExternalResources: ['script'],
            MutationEvents: '2.0',
            QuerySelector: false,
        },
        done: function (err, window) {
            global.window = window;
            global.document = window.document;
            if (onInit) {
                onInit();
            }
        },
    });
}
function teardownJsDom() {
    delete global.window;
    delete global.document;
}
export { setupJsDom, teardownJsDom };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL3Rlc3RfaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sc0JBQXNCLENBQUM7QUFPOUMsb0JBQW9CLE1BQU87SUFDekIsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNSLElBQUksRUFBRSx1UUFXTDtRQUNELFFBQVEsRUFBRTtZQUNSLHNCQUFzQixFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ2xDLHdCQUF3QixFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ3BDLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGFBQWEsRUFBRSxLQUFLO1NBQ3JCO1FBQ0QsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU07WUFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBRWxDLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxDQUFDO2FBQ1Y7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0UsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ3JCLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUN6QixDQUFDO0FBRUQsT0FBTyxFQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUMsQ0FBQyJ9