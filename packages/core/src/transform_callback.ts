import {Variant} from "./variant";

export interface IShuboxFile {
  s3url: string;
  transforms: any;
}

export class TransformCallback {
  public file: IShuboxFile;
  public variant: string = "";
  public variantUrl: string = "";
  public callback: (file: IShuboxFile) => void;
  public retry: number = 10;
  public success: boolean = false;

  constructor(file: IShuboxFile, variant: string = "", callback: (file: IShuboxFile) => void) {
    this.file = file;
    this.variant = variant;
    this.variantUrl = new Variant(file, variant).url();
    this.callback = callback;
  }

  public run = (error: any = null) => {
    const delay = Math.pow(2, 19 - this.retry); // 512, 1024, 2048, 4096 ...

    if (this.retry && !this.success) {
      this.retry -= 1;

      setTimeout(() => {
        fetch(this.cacheBustedUrl(), { method: "HEAD" })
          .then(this.validateResponse)
          .catch(this.run);
      }, delay);
    }
  }

  public validateResponse = (response: any) => {
    if (!response.ok) { throw Error(response.statusText); }

    this.success = true;
    this.file.transforms = this.file.transforms ? this.file.transforms : {};
    this.file.transforms[this.variant] = { s3url: this.variantUrl };
    this.callback(this.file);

    return response;
  }

  private cacheBustedUrl = () => {
    const rand = Math.floor(Math.random() * Math.floor(10000000000));

    return `${this.variantUrl}?q=${rand}`;
  }
}
