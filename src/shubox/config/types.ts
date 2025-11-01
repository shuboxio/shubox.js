import type Dropzone from 'dropzone'

export interface IS3Signature {
  aws_endpoint: string
  signature: string
  policy: string
  key: string
  acl?: string
  success_action_status?: string
  'Content-Type'?: string
  'x-amz-credential'?: string
  'x-amz-algorithm'?: string
  'x-amz-date'?: string
  'x-amz-signature'?: string
  [key: string]: any
}

export interface ITransformResult {
  s3url: string
  ready: boolean
}

export interface ISignatureOptions {
  key: string
  s3Key?: string
  extraParams?: Record<string, any>
}

export interface ITemplateData {
  s3url?: string
  name?: string
  size?: number
  [key: string]: any
}

export interface IApiClientConfig {
  baseUrl?: string
  signatureUrl?: string
  uploadUrl?: string
  key: string
}

export interface IDropzoneFile extends Dropzone.DropzoneFile {
  s3url?: string
  transform?: ITransformResult
}
