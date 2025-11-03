import Dropzone from 'dropzone';

/**
 * Response from Shubox API signature endpoint
 */
export interface SignatureResponse {
  aws_endpoint: string;
  key: string;
  policy: string;
  success_action_status: string;
  acl: string;
  'x-amz-credential': string;
  'x-amz-algorithm': string;
  'x-amz-date': string;
  'x-amz-signature': string;
  error?: string;
  [key: string]: string | undefined;
}

/**
 * Result of a transform operation
 */
export interface TransformResult {
  s3url: string;
}

/**
 * Callback function for transform completion
 */
export type TransformCallback = (file: IShuboxFile) => void;

/**
 * Extended Dropzone file with Shubox-specific properties
 */
export interface ShuboxDropzoneFile extends Dropzone.DropzoneFile {
  s3: string;
  s3url: string;
  postData: SignatureResponse;
  transforms?: Record<string, TransformResult>;
  transform?: TransformResult;
  _shuboxRetryCount?: number;
  _shuboxRetryTimeout?: NodeJS.Timeout;
}

/**
 * Unified interface for Shubox files with all possible properties
 * Merges properties from the 3 previous duplicate IShuboxFile definitions
 */
export interface IShuboxFile extends ShuboxDropzoneFile {
  width: number;
  height: number;
  lastModified: number;
  lastModifiedDate: Date;
}

/**
 * Extra parameters to send with upload
 */
export type ExtraParams = Record<string, string | number | boolean>;

/**
 * Collection of transform callbacks keyed by variant name
 */
export type TransformCallbacks = Record<string, TransformCallback>;

/**
 * Complete Shubox configuration options
 */
export interface ShuboxOptions
  extends Omit<
    Dropzone.DropzoneOptions,
    'previewsContainer' | 'success' | 'error' | 'sending' | 'addedfile'
  > {
  // Shubox-specific options
  acceptedFiles?: string;
  cdn?: string | null;
  extraParams?: ExtraParams;
  previewsContainer?: string | HTMLElement | boolean;
  s3Key?: string | null;
  successTemplate?: string;
  textBehavior?: 'replace' | 'append' | 'insertAtCursor';
  transforms?: TransformCallbacks | null;
  uploadingTemplate?: string;

  // Error handling options
  timeout?: number;
  retryAttempts?: number;
  onRetry?: (attempt: number, error: Error, file: ShuboxDropzoneFile) => void;
  offlineCheck?: boolean;

  // Deprecated options (kept for backward compatibility)
  /** @deprecated Use transforms instead */
  transformCallbacks?: TransformCallbacks | null;
  /** @deprecated Use transforms instead */
  transformName?: string | null;
  /** @deprecated Use successTemplate instead */
  s3urlTemplate?: string;

  // Callback overrides with proper types
  success?: (file: ShuboxDropzoneFile) => void;
  error?: (file: ShuboxDropzoneFile, message: string | Error) => void;
  sending?: (file: ShuboxDropzoneFile, xhr: XMLHttpRequest, formData: FormData) => void;
  addedfile?: (file: ShuboxDropzoneFile) => void;
  canceled?: (file: ShuboxDropzoneFile) => void;
  removedfile?: (file: ShuboxDropzoneFile) => void;
  queuecomplete?: () => void;
}

/**
 * Callback methods returned by ShuboxCallbacks.toHash()
 */
export interface ShuboxCallbackMethods {
  accept: (file: ShuboxDropzoneFile, done: (error?: string | Error) => void) => void;
  sending: (file: ShuboxDropzoneFile, xhr: XMLHttpRequest, formData: FormData) => void;
  addedfile: (file: ShuboxDropzoneFile) => void;
  success: (file: ShuboxDropzoneFile, response: string) => void;
  error: (file: ShuboxDropzoneFile, message: string | Error) => void;
  uploadProgress: (file: ShuboxDropzoneFile, progress: number, bytesSent: number) => void;
  canceled: (file: ShuboxDropzoneFile) => void;
  removedfile: (file: ShuboxDropzoneFile) => void;
  queuecomplete: () => void;
}
