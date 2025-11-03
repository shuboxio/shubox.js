import Shubox from '../core/Shubox';
import { filenameFromFile } from '../utils/filenameFromFile';
import { objectToFormData } from '../utils/objectToFormData';
import type { IShuboxFile, ExtraParams } from '../core/types';

import { fetchWithRetry } from './fetchWithRetry';

export async function uploadCompleteEvent(
  shubox: Shubox,
  file: IShuboxFile,
  extraParams: ExtraParams,
): Promise<Response | null> {
  try {
    const response = await fetchWithRetry(
      shubox.uploadUrl,
      {
        headers: { 'X-Shubox-Client': shubox.version },
        body: objectToFormData({
          bucket: 'localhost-4100',
          extraParams,
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
          transforms: shubox.options.transforms,
        }),
        method: 'POST',
        mode: 'cors',
      },
      {
        retryAttempts: shubox.options.retryAttempts || 3,
        timeout: shubox.options.timeout || 30000,
      },
    );

    return response;
  } catch (err) {
    // This is non-critical metadata upload, so we log the error but don't block the UI
    // The main upload has already succeeded at this point
    console.error(
      `Upload complete notification failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}
