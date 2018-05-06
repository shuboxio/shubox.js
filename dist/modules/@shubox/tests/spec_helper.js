import * as jsdom from 'jsdom/lib/old-api.js';
function setupJsDom(onInit) {
    jsdom.env({
        html: '<!DOCTYPE html><html><head></head><body></body></html>',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY19oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac2h1Ym94L3Rlc3RzL3NwZWNfaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sc0JBQXNCLENBQUM7QUFPOUMsb0JBQW9CLE1BQU87SUFDekIsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNSLElBQUksRUFBRSx3REFBd0Q7UUFDOUQsUUFBUSxFQUFFO1lBQ1Isc0JBQXNCLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEMsd0JBQXdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDcEMsY0FBYyxFQUFFLEtBQUs7WUFDckIsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTTtZQUNoQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN2QixNQUFNLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFFbEMsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLENBQUM7YUFDVjtRQUNILENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7SUFDRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDckIsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3pCLENBQUM7QUFFRCxPQUFPLEVBQUMsVUFBVSxFQUFFLGFBQWEsRUFBQyxDQUFDIn0=