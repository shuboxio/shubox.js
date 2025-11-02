// src/shubox/config.ts
export class ShuboxConfig {
  static readonly DEFAULT_TIMEOUT = 30000;
  static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  static readonly REPLACEABLE_VARIABLES = [
    'height',
    'width',
    'name',
    's3',
    's3url',
    'size',
    'type',
  ];
  static readonly DEFAULT_ACCEPTED_FILES = 'image/*';
  static readonly DEFAULT_TEXT_BEHAVIOR = 'replace';
  static readonly DEFAULT_SUCCESS_TEMPLATE = '{{s3url}}';
  static readonly DEFAULT_UPLOADING_TEMPLATE = '';
}
