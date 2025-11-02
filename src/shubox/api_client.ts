// src/shubox/api_client.ts
import Shubox from './index';
import { fetchWithRetry } from './fetch_with_retry';
import { objectToFormData } from './object_to_form_data';
import { filenameFromFile } from './filename_from_file';
import type { SignatureResponse } from './types';

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface FetchSignatureOptions {
  s3Key?: string;
  retryAttempts?: number;
  timeout?: number;
}

export class ShuboxApiClient {
  constructor(private shubox: Shubox) {}

  async fetchSignature(
    file: FileInfo,
    options: FetchSignatureOptions = {}
  ): Promise<SignatureResponse> {
    const response = await fetchWithRetry(
      this.shubox.signatureUrl,
      {
        headers: {
          'X-Shubox-Client': this.shubox.version,
        },
        body: objectToFormData({
          file: {
            name: filenameFromFile({ name: file.name } as any),
            size: file.size,
            type: file.type,
          },
          key: this.shubox.key,
          s3Key: options.s3Key,
        }),
        method: 'post',
        mode: 'cors',
      },
      {
        retryAttempts: options.retryAttempts || this.shubox.options.retryAttempts || 3,
        timeout: options.timeout || this.shubox.options.timeout || 30000,
      }
    );

    if (!response.ok) {
      throw new Error(`Signature fetch failed: ${response.statusText}`);
    }

    return response.json() as Promise<SignatureResponse>;
  }
}
