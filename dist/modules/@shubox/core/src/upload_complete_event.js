import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
export function uploadCompleteEvent(shubox, file, extraParams) {
    fetch(shubox.uploadUrl, {
        method: 'POST',
        mode: 'cors',
        body: objectToFormData({
            key: shubox.key,
            transformName: shubox.options.transformName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkX2NvbXBsZXRlX2V2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy91cGxvYWRfY29tcGxldGVfZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFZdEQsTUFBTSw4QkFDSixNQUFjLEVBQ2QsSUFBZ0IsRUFDaEIsV0FBbUI7SUFHbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDdEIsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztZQUNyQixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7WUFDZixhQUFhLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQzNDLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLE1BQU0sRUFBRSxnQkFBZ0I7WUFFeEIsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQy9CLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3ZDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7YUFDaEI7U0FDRixDQUFDO0tBQ0gsQ0FBQztTQUNELEtBQUssQ0FBQyxVQUFTLEdBQUc7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBMEMsR0FBRyxDQUFDLE9BQVMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9