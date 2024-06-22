export interface IShuboxFile {
  s3url: string;
}

export class Variant {
  public s3url: string = "";
  public variant: string = "";
  public doVariantCharacterTranslation: boolean = true;
  public apiVersion: number = 1.0;

  constructor(
    file: IShuboxFile,
    variant: string = "",
    apiVersion: number = 1.0,
    doVariantCharacterTranslation: boolean = true
  ) {
    this.s3url = file.s3url;
    this.variant = variant;
    this.apiVersion = apiVersion;
    this.doVariantCharacterTranslation = doVariantCharacterTranslation;
  }

  public url(): string {
    const filename = this.s3url.substring(this.s3url.lastIndexOf("/") + 1);
    const [geometry, vExtension] = this.variant.split(".");
    let newFilename = "";

    newFilename = this.cleanFilename(filename);
    newFilename = this.variantType(geometry, newFilename);
    newFilename = this.variantFiletype(vExtension, newFilename);

    return (this.s3url.replace(filename, newFilename));
  }

  private cleanFilename(filename: string): string {
    return (filename.replace(/\+/g, "%2B"));
  }

  private variantType(geometry: string, filename: string): string {
    if (!geometry) { return (filename); }

    geometry = this.doVariantCharacterTranslation ?
      geometry.replace(/\#$/, "_hash").replace(/\^$/, "_carat").replace(/\!$/, "_bang") :
      geometry.replace(/\#$/, "%23");

    return (`${geometry}_${filename}`);
  }

  private variantFiletype(extension: string, filename: string): string {
    if (!extension) { return (filename); }

    return (this.apiVersion > 1.0) ?
      filename.replace(/\.[a-zA-Z0-9]+$/, `.${extension}`) :
      `${filename}.${extension}`
  }
}
