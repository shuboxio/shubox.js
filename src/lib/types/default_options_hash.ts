export interface DefaultOptionsHash {
  success?: (file:Dropzone.DropzoneFile) => void;
  error?: (file: any, message: string) => void;
  textBehavior?: string;
  s3urlTemplate?: string;
  acceptedFiles?: string;
  clickable?: boolean;
  previewsContainer?: null | string | HTMLElement;
  dictMaxFilesExceeded?: string;
  maxFiles?: null | number;
  extraParams?: object;
}
