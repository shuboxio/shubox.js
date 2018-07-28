import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
export function uploadCompleteEvent(shubox, file, extraParams) {
    fetch(shubox.uploadUrl, {
        method: 'POST',
        mode: 'cors',
        body: objectToFormData({
            uuid: shubox.uuid,
            extraParams: extraParams,
            bucket: 'localhost-4100',
            file: {
                width: file.width,
                height: file.height,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: filenameFromFile(file),
                s3Path: file.s3,
                s3Url: file.s3url,
                size: file.size,
                type: file.type,
            },
        }),
    })
        .catch(function (err) {
        console.log("There was a problem with your request: " + err.message);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkX2NvbXBsZXRlX2V2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy91cGxvYWRfY29tcGxldGVfZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFZdEQsTUFBTSw4QkFDSixNQUFjLEVBQ2QsSUFBZ0IsRUFDaEIsV0FBbUI7SUFHbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDdEIsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztZQUNyQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsTUFBTSxFQUFFLGdCQUFnQjtZQUV4QixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDL0IsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtnQkFDdkMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDNUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTthQUNoQjtTQUNGLENBQUM7S0FDSCxDQUFDO1NBQ0QsS0FBSyxDQUFDLFVBQVMsR0FBRztRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUEwQyxHQUFHLENBQUMsT0FBUyxDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIn0=