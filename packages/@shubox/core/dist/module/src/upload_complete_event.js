import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
export function uploadCompleteEvent(file, extraParams) {
    fetch('https://localhost:4101/uploads', {
        method: 'post',
        mode: 'cors',
        body: objectToFormData({
            extraParams: extraParams,
            bucket: 'localhost-4100',
            uploaded: {
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
    }).catch(function (err) {
        console.log('There was a problem with your request:' + err.message);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkX2NvbXBsZXRlX2V2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy91cGxvYWRfY29tcGxldGVfZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFXdEQsTUFBTSw4QkFBOEIsSUFBZ0IsRUFBRSxXQUFtQjtJQUN2RSxLQUFLLENBQUMsZ0NBQWdDLEVBQUU7UUFDdEMsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxnQkFBZ0IsQ0FBQztZQUNyQixXQUFXLEVBQUUsV0FBVztZQUN4QixNQUFNLEVBQUUsZ0JBQWdCO1lBRXhCLFFBQVEsRUFBRTtnQkFDUixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2dCQUN2QyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2dCQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2hCO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBUyxHQUFHO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9