import { TransformError } from '../errors/ShuboxError';
import type { IShuboxFile, TransformResult } from '../core/types';

import { Variant } from './Variant';

export class TransformCallback {
  public file: IShuboxFile;
  public variant: string = '';
  public variantUrl: string = '';
  public callback: (file: IShuboxFile) => void;
  public errorCallback?: (file: IShuboxFile, error: Error | string) => void;
  public retry: number = 10;
  public success: boolean = false;

  constructor(
    file: IShuboxFile,
    variant: string = '',
    callback: (file: IShuboxFile) => void,
    apiVersion: number = 1.0,
    doVariantCharacterTranslation: boolean = true,
    errorCallback?: (file: IShuboxFile, error: Error | string) => void,
  ) {
    this.file = file;
    this.variant = variant;
    this.variantUrl = new Variant(file, variant, apiVersion, doVariantCharacterTranslation).url();
    this.callback = callback;
    this.errorCallback = errorCallback;
  }

  public run = (error?: Error | string) => {
    const delay = Math.pow(2, 19 - this.retry); // 512, 1024, 2048, 4096 ...

    if (this.retry && !this.success) {
      this.retry -= 1;

      setTimeout(() => {
        fetch(this.cacheBustedUrl(), { method: 'HEAD' })
          .then(this.validateResponse)
          .catch(this.run);
      }, delay);
    } else if (!this.success && this.errorCallback) {
      // Retries exhausted and transform failed - notify user
      const transformError = new TransformError(
        `Image processing failed for variant '${this.variant}'. Original file uploaded successfully.`,
        this.variant,
        error instanceof Error ? error : undefined,
      );
      this.errorCallback(this.file, transformError);
    }
  };

  public validateResponse = (response: Response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    this.success = true;
    this.file.transforms = this.file.transforms ? this.file.transforms : {};
    this.file.transforms[this.variant] = this.file.transform = { s3url: this.variantUrl };
    this.callback(this.file);

    return response;
  };

  private cacheBustedUrl = () => {
    const rand = Math.floor(Math.random() * Math.floor(10000000000));

    return `${this.variantUrl}?q=${rand}`;
  };
}
