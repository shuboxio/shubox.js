import { filenameFromFile } from "./filename_from_file";
import { objectToFormData } from "./object_to_form_data";
export function uploadCompleteEvent(shubox, file, extraParams) {
    fetch(shubox.uploadUrl, {
        body: objectToFormData({
            bucket: "localhost-4100",
            extraParams: extraParams,
            file: {
                height: file.height,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                name: filenameFromFile(file),
                s3Path: file.s3,
                s3Url: file.s3url,
                size: file.size,
                type: file.type,
                width: file.width,
            },
            key: shubox.key,
            transformName: shubox.options.transformName,
        }),
        method: "POST",
        mode: "cors",
    })
        .catch(function (err) {
        console.log("There was a problem with your request: " + err.message);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkX2NvbXBsZXRlX2V2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHNodWJveC9jb3JlL3NyYy91cGxvYWRfY29tcGxldGVfZXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFZdkQsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxNQUFjLEVBQ2QsSUFBaUIsRUFDakIsV0FBbUI7SUFHbkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDdEIsSUFBSSxFQUFFLGdCQUFnQixDQUFDO1lBQ3JCLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsV0FBVyxhQUFBO1lBQ1gsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2dCQUN2QyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO2dCQUM1QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzthQUNsQjtZQUNELEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztZQUNmLGFBQWEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWE7U0FDNUMsQ0FBQztRQUNGLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLE1BQU07S0FDYixDQUFDO1NBQ0QsS0FBSyxDQUFDLFVBQUMsR0FBRztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsNENBQTBDLEdBQUcsQ0FBQyxPQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMifQ==