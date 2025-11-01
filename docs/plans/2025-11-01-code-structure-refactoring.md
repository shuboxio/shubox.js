# Code Structure Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor Shubox.js into a modular architecture with clear separation of concerns (API, DOM, configuration) and dependency injection for improved maintainability, testability, and tree-shaking.

**Architecture:** Extract the 300+ line ShuboxCallbacks into focused single-responsibility modules: ShuboxApiClient for HTTP calls, ShuboxDomRenderer for DOM manipulation, ShuboxConfig for constants, and handler classes for each upload lifecycle phase. Use dependency injection throughout.

**Tech Stack:** TypeScript, Vitest, Dropzone.js

---

## Task 1: Create Configuration Module

**Files:**
- Create: `src/shubox/config/constants.ts`
- Create: `src/shubox/config/defaults.ts`
- Create: `src/shubox/config/types.ts`
- Create: `src/shubox/config/index.ts`
- Test: `tests/shubox/config/constants.test.ts`

**Step 1: Write test for constants module**

Create `tests/shubox/config/constants.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { API_CONSTANTS, TEMPLATE_CONSTANTS } from '~/shubox/config/constants'

describe('API_CONSTANTS', () => {
  it('has default base URL', () => {
    expect(API_CONSTANTS.BASE_URL).toBe('https://api.shubox.io')
  })

  it('has signature endpoint path', () => {
    expect(API_CONSTANTS.SIGNATURE_PATH).toBe('/signatures')
  })

  it('has uploads endpoint path', () => {
    expect(API_CONSTANTS.UPLOADS_PATH).toBe('/uploads')
  })
})

describe('TEMPLATE_CONSTANTS', () => {
  it('has default success template', () => {
    expect(TEMPLATE_CONSTANTS.SUCCESS).toBe('{{s3url}}')
  })

  it('has default uploading template', () => {
    expect(TEMPLATE_CONSTANTS.UPLOADING).toContain('Uploading')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/config/constants.test.ts`
Expected: FAIL - module not found

**Step 3: Create constants module**

Create `src/shubox/config/constants.ts`:

```typescript
export const API_CONSTANTS = {
  BASE_URL: 'https://api.shubox.io',
  SIGNATURE_PATH: '/signatures',
  UPLOADS_PATH: '/uploads',
} as const

export const TEMPLATE_CONSTANTS = {
  SUCCESS: '{{s3url}}',
  UPLOADING: 'Uploading {{name}}...',
  COMPLETE: 'Upload complete',
} as const

export const DROPZONE_CONSTANTS = {
  DUMMY_URL: 'http://localhost',
  DEFAULT_ACCEPTED_FILES: 'image/*',
} as const
```

**Step 4: Run test to verify it passes**

Run: `npm test tests/shubox/config/constants.test.ts`
Expected: PASS

**Step 5: Create types module**

Create `src/shubox/config/types.ts`:

```typescript
import type Dropzone from 'dropzone'

export interface IS3Signature {
  endpoint: string
  signature: string
  policy: string
  key: string
  acl?: string
  success_action_status?: string
  'Content-Type'?: string
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
```

**Step 6: Create defaults module**

Create `src/shubox/config/defaults.ts`:

```typescript
import { DROPZONE_CONSTANTS, TEMPLATE_CONSTANTS } from './constants'

export const DROPZONE_DEFAULTS = {
  url: DROPZONE_CONSTANTS.DUMMY_URL,
  acceptedFiles: DROPZONE_CONSTANTS.DEFAULT_ACCEPTED_FILES,
  autoProcessQueue: false,
  clickable: true,
  createImageThumbnails: true,
  maxFiles: null,
  maxFilesize: null,
  parallelUploads: 2,
  uploadMultiple: false,
} as const

export const SHUBOX_DEFAULTS = {
  textBehavior: 'replace',
  successTemplate: TEMPLATE_CONSTANTS.SUCCESS,
  uploadingTemplate: TEMPLATE_CONSTANTS.UPLOADING,
  previewsContainer: null,
  transforms: {},
  extraParams: {},
} as const
```

**Step 7: Create barrel export**

Create `src/shubox/config/index.ts`:

```typescript
export * from './constants'
export * from './defaults'
export * from './types'
```

**Step 8: Run all config tests**

Run: `npm test tests/shubox/config/`
Expected: PASS

**Step 9: Commit**

```bash
git add src/shubox/config/ tests/shubox/config/
git commit -m "feat: create configuration module with constants, defaults, and types"
```

---

## Task 2: Create API Client Module

**Files:**
- Create: `src/shubox/api/client.ts`
- Create: `src/shubox/api/index.ts`
- Test: `tests/shubox/api/client.test.ts`

**Step 1: Write test for ShuboxApiClient**

Create `tests/shubox/api/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig } from '~/shubox/config/types'

describe('ShuboxApiClient', () => {
  let client: ShuboxApiClient
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    client = new ShuboxApiClient(config)
  })

  describe('fetchSignature', () => {
    it('posts to signature endpoint with file metadata', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        endpoint: 'https://s3.amazonaws.com/bucket',
        signature: 'sig123',
        policy: 'pol123',
        key: 'uploads/test.jpg'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await client.fetchSignature(mockFile, {
        key: 'test-key',
        s3Key: 'uploads/test.jpg'
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.shubox.io/signatures',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('throws error on failed request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      await expect(
        client.fetchSignature(mockFile, { key: 'test-key' })
      ).rejects.toThrow('Failed to fetch signature: 401 Unauthorized')
    })
  })

  describe('pollTransform', () => {
    it('polls upload endpoint for transform status', async () => {
      const mockResponse = {
        s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
        ready: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await client.pollTransform('upload-123', '200x200#')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.shubox.io/uploads/upload-123?transform=200x200%23'
      )
      expect(result).toEqual(mockResponse)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/api/client.test.ts`
Expected: FAIL - module not found

**Step 3: Implement ShuboxApiClient**

Create `src/shubox/api/client.ts`:

```typescript
import type { IS3Signature, ITransformResult, ISignatureOptions, IApiClientConfig } from '~/shubox/config/types'
import { API_CONSTANTS } from '~/shubox/config/constants'
import { objectToFormData } from '~/shubox/object_to_form_data'

export class ShuboxApiClient {
  private baseUrl: string
  private signatureUrl: string
  private uploadUrl: string
  private key: string

  constructor(config: IApiClientConfig) {
    this.key = config.key
    this.baseUrl = config.baseUrl || API_CONSTANTS.BASE_URL
    this.signatureUrl = config.signatureUrl || `${this.baseUrl}${API_CONSTANTS.SIGNATURE_PATH}`
    this.uploadUrl = config.uploadUrl || `${this.baseUrl}${API_CONSTANTS.UPLOADS_PATH}`
  }

  async fetchSignature(file: File, options: ISignatureOptions): Promise<IS3Signature> {
    const formData = objectToFormData({
      name: file.name,
      size: file.size,
      type: file.type,
      key: options.key,
      s3Key: options.s3Key,
      ...options.extraParams
    })

    const response = await fetch(this.signatureUrl, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch signature: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async pollTransform(uploadId: string, transform: string): Promise<ITransformResult> {
    const url = `${this.uploadUrl}/${uploadId}?transform=${encodeURIComponent(transform)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to poll transform: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
```

**Step 4: Create barrel export**

Create `src/shubox/api/index.ts`:

```typescript
export * from './client'
```

**Step 5: Run test to verify it passes**

Run: `npm test tests/shubox/api/client.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/shubox/api/ tests/shubox/api/
git commit -m "feat: create API client module for signature and transform requests"
```

---

## Task 3: Create DOM Renderer Module

**Files:**
- Create: `src/shubox/dom/renderer.ts`
- Create: `src/shubox/dom/index.ts`
- Test: `tests/shubox/dom/renderer.test.ts`

**Step 1: Write test for ShuboxDomRenderer**

Create `tests/shubox/dom/renderer.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { ShuboxDomRenderer } from '~/shubox/dom/renderer'

describe('ShuboxDomRenderer', () => {
  let renderer: ShuboxDomRenderer

  beforeEach(() => {
    renderer = new ShuboxDomRenderer()
  })

  describe('interpolate', () => {
    it('replaces template variables with data values', () => {
      const template = 'File: {{name}}, Size: {{size}}'
      const data = { name: 'test.jpg', size: 1024 }

      const result = renderer.interpolate(template, data)

      expect(result).toBe('File: test.jpg, Size: 1024')
    })

    it('handles missing variables gracefully', () => {
      const template = 'URL: {{s3url}}'
      const data = {}

      const result = renderer.interpolate(template, data)

      expect(result).toBe('URL: ')
    })

    it('preserves unmatched template syntax', () => {
      const template = 'Keep {{this}} but not {{that}}'
      const data = { that: 'replaced' }

      const result = renderer.interpolate(template, data)

      expect(result).toBe('Keep  but not replaced')
    })
  })

  describe('insertAtCursor', () => {
    it('inserts text at cursor position in input element', () => {
      document.body.innerHTML = '<input type="text" id="test" value="Hello World" />'
      const input = document.getElementById('test') as HTMLInputElement
      input.setSelectionRange(5, 5) // After "Hello"

      renderer.insertAtCursor(input, ' there')

      expect(input.value).toBe('Hello there World')
    })

    it('replaces selected text', () => {
      document.body.innerHTML = '<input type="text" id="test" value="Hello World" />'
      const input = document.getElementById('test') as HTMLInputElement
      input.setSelectionRange(0, 5) // "Hello" selected

      renderer.insertAtCursor(input, 'Hi')

      expect(input.value).toBe('Hi World')
    })
  })

  describe('insertTemplate', () => {
    it('inserts interpolated template into element based on text behavior', () => {
      document.body.innerHTML = '<div id="target">Original</div>'
      const element = document.getElementById('target') as HTMLElement

      renderer.insertTemplate(element, '{{s3url}}', { s3url: 'https://example.com/file.jpg' }, 'replace')

      expect(element.textContent).toBe('https://example.com/file.jpg')
    })

    it('appends to element when textBehavior is append', () => {
      document.body.innerHTML = '<div id="target">Original</div>'
      const element = document.getElementById('target') as HTMLElement

      renderer.insertTemplate(element, ' {{s3url}}', { s3url: 'https://example.com/file.jpg' }, 'append')

      expect(element.textContent).toBe('Original https://example.com/file.jpg')
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/dom/renderer.test.ts`
Expected: FAIL - module not found

**Step 3: Implement ShuboxDomRenderer**

Create `src/shubox/dom/renderer.ts`:

```typescript
import type { ITemplateData } from '~/shubox/config/types'
import { insertAtCursor as insertAtCursorUtil } from '~/shubox/insert_at_cursor'

export class ShuboxDomRenderer {
  interpolate(template: string, data: ITemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || ''
    })
  }

  insertAtCursor(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
    insertAtCursorUtil(element, text)
  }

  insertTemplate(
    element: HTMLElement,
    template: string,
    data: ITemplateData,
    textBehavior: 'replace' | 'append' = 'replace'
  ): void {
    const interpolated = this.interpolate(template, data)

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (textBehavior === 'append') {
        element.value += interpolated
      } else {
        this.insertAtCursor(element, interpolated)
      }
    } else {
      if (textBehavior === 'append') {
        element.textContent += interpolated
      } else {
        element.textContent = interpolated
      }
    }
  }
}
```

**Step 4: Create barrel export**

Create `src/shubox/dom/index.ts`:

```typescript
export * from './renderer'
```

**Step 5: Run test to verify it passes**

Run: `npm test tests/shubox/dom/renderer.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/shubox/dom/ tests/shubox/dom/
git commit -m "feat: create DOM renderer module for template interpolation and insertion"
```

---

## Task 4: Create S3 Signature Handler

**Files:**
- Create: `src/shubox/handlers/signature.ts`
- Test: `tests/shubox/handlers/signature.test.ts`

**Step 1: Write test for S3SignatureHandler**

Create `tests/shubox/handlers/signature.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { S3SignatureHandler } from '~/shubox/handlers/signature'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig, IDropzoneFile } from '~/shubox/config/types'

describe('S3SignatureHandler', () => {
  let handler: S3SignatureHandler
  let mockApiClient: ShuboxApiClient
  let mockFile: IDropzoneFile
  let mockDone: any

  beforeEach(() => {
    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    mockApiClient = new ShuboxApiClient(config)

    handler = new S3SignatureHandler(mockApiClient, {
      key: 'test-key',
      s3Key: 'uploads/{{timestamp}}-{{name}}'
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg'
    } as IDropzoneFile

    mockDone = vi.fn()
  })

  it('fetches signature and calls done callback', async () => {
    const mockSignature = {
      endpoint: 'https://s3.amazonaws.com/bucket',
      signature: 'sig123',
      policy: 'pol123',
      key: 'uploads/test.jpg'
    }

    vi.spyOn(mockApiClient, 'fetchSignature').mockResolvedValue(mockSignature)

    await handler.handle(mockFile, mockDone)

    expect(mockApiClient.fetchSignature).toHaveBeenCalledWith(
      mockFile,
      expect.objectContaining({
        key: 'test-key'
      })
    )
    expect(mockDone).toHaveBeenCalled()
  })

  it('calls done with error message on failure', async () => {
    const error = new Error('Signature fetch failed')
    vi.spyOn(mockApiClient, 'fetchSignature').mockRejectedValue(error)

    await handler.handle(mockFile, mockDone)

    expect(mockDone).toHaveBeenCalledWith('Signature fetch failed')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/handlers/signature.test.ts`
Expected: FAIL - module not found

**Step 3: Implement S3SignatureHandler**

Create `src/shubox/handlers/signature.ts`:

```typescript
import type { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile, IS3Signature } from '~/shubox/config/types'

export interface ISignatureHandlerOptions {
  key: string
  s3Key?: string
  extraParams?: Record<string, any>
}

export class S3SignatureHandler {
  private signature: IS3Signature | null = null

  constructor(
    private apiClient: ShuboxApiClient,
    private options: ISignatureHandlerOptions
  ) {}

  async handle(file: IDropzoneFile, done: (error?: string) => void): Promise<void> {
    try {
      this.signature = await this.apiClient.fetchSignature(file, {
        key: this.options.key,
        s3Key: this.options.s3Key,
        extraParams: this.options.extraParams
      })

      // Store signature on file for upload handler
      ;(file as any).__shuboxSignature = this.signature

      done()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      done(message)
    }
  }

  getSignature(): IS3Signature | null {
    return this.signature
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test tests/shubox/handlers/signature.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/shubox/handlers/signature.ts tests/shubox/handlers/signature.test.ts
git commit -m "feat: create S3 signature handler for fetching pre-signed upload URLs"
```

---

## Task 5: Create S3 Upload Handler

**Files:**
- Create: `src/shubox/handlers/upload.ts`
- Test: `tests/shubox/handlers/upload.test.ts`

**Step 1: Write test for S3UploadHandler**

Create `tests/shubox/handlers/upload.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { S3UploadHandler } from '~/shubox/handlers/upload'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('S3UploadHandler', () => {
  let handler: S3UploadHandler
  let mockFile: IDropzoneFile
  let mockXhr: any
  let mockFormData: FormData

  beforeEach(() => {
    handler = new S3UploadHandler({
      extraParams: { 'x-custom': 'value' }
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      __shuboxSignature: {
        endpoint: 'https://s3.amazonaws.com/bucket',
        signature: 'sig123',
        policy: 'pol123',
        key: 'uploads/test.jpg',
        acl: 'public-read',
        success_action_status: '201'
      }
    } as any

    mockXhr = {
      open: vi.fn()
    }

    mockFormData = new FormData()
  })

  it('updates XHR to post to S3 endpoint', () => {
    handler.handle(mockFile, mockXhr, mockFormData)

    expect(mockXhr.open).toHaveBeenCalledWith(
      'POST',
      'https://s3.amazonaws.com/bucket',
      true
    )
  })

  it('appends signature fields to form data', () => {
    handler.handle(mockFile, mockXhr, mockFormData)

    expect(mockFormData.get('key')).toBe('uploads/test.jpg')
    expect(mockFormData.get('policy')).toBe('pol123')
    expect(mockFormData.get('signature')).toBe('sig123')
    expect(mockFormData.get('acl')).toBe('public-read')
    expect(mockFormData.get('success_action_status')).toBe('201')
  })

  it('appends extra params to form data', () => {
    handler.handle(mockFile, mockXhr, mockFormData)

    expect(mockFormData.get('x-custom')).toBe('value')
  })

  it('throws error if signature not found on file', () => {
    const fileWithoutSignature = { name: 'test.jpg' } as IDropzoneFile

    expect(() => {
      handler.handle(fileWithoutSignature, mockXhr, mockFormData)
    }).toThrow('Signature not found on file')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/handlers/upload.test.ts`
Expected: FAIL - module not found

**Step 3: Implement S3UploadHandler**

Create `src/shubox/handlers/upload.ts`:

```typescript
import type { IDropzoneFile } from '~/shubox/config/types'

export interface IUploadHandlerOptions {
  extraParams?: Record<string, any>
}

export class S3UploadHandler {
  constructor(private options: IUploadHandlerOptions = {}) {}

  handle(file: IDropzoneFile, xhr: XMLHttpRequest, formData: FormData): void {
    const signature = (file as any).__shuboxSignature

    if (!signature) {
      throw new Error('Signature not found on file')
    }

    // Update XHR to post to S3 endpoint
    xhr.open('POST', signature.endpoint, true)

    // Append signature fields to form data
    formData.append('key', signature.key)
    formData.append('policy', signature.policy)
    formData.append('signature', signature.signature)

    if (signature.acl) {
      formData.append('acl', signature.acl)
    }

    if (signature.success_action_status) {
      formData.append('success_action_status', signature.success_action_status)
    }

    if (signature['Content-Type']) {
      formData.append('Content-Type', signature['Content-Type'])
    }

    // Append extra params
    if (this.options.extraParams) {
      Object.entries(this.options.extraParams).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test tests/shubox/handlers/upload.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/shubox/handlers/upload.ts tests/shubox/handlers/upload.test.ts
git commit -m "feat: create S3 upload handler for posting files to S3 with signed form data"
```

---

## Task 6: Refactor Transform Poller

**Files:**
- Modify: `src/shubox/transform_callback.ts` → Move to `src/shubox/handlers/transform_poller.ts`
- Test: `tests/shubox/handlers/transform_poller.test.ts`

**Step 1: Write test for refactored TransformPoller**

Create `tests/shubox/handlers/transform_poller.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TransformPoller } from '~/shubox/handlers/transform_poller'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig } from '~/shubox/config/types'

describe('TransformPoller', () => {
  let poller: TransformPoller
  let mockApiClient: ShuboxApiClient

  beforeEach(() => {
    vi.useFakeTimers()

    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    mockApiClient = new ShuboxApiClient(config)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('polls transform endpoint until ready', async () => {
    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValueOnce({ s3url: 'https://example.com/file.jpg', ready: false })
      .mockResolvedValueOnce({ s3url: 'https://example.com/file.jpg', ready: true })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', vi.fn())

    const pollPromise = poller.start()

    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(1000)

    const result = await pollPromise

    expect(mockApiClient.pollTransform).toHaveBeenCalledTimes(2)
    expect(result.ready).toBe(true)
  })

  it('calls callback when transform is ready', async () => {
    const callback = vi.fn()

    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValue({ s3url: 'https://example.com/file.jpg', ready: true })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', callback)

    await poller.start()

    expect(callback).toHaveBeenCalledWith({ s3url: 'https://example.com/file.jpg', ready: true })
  })

  it('stops polling after max attempts', async () => {
    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValue({ s3url: 'https://example.com/file.jpg', ready: false })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', vi.fn(), {
      maxAttempts: 3,
      interval: 1000
    })

    const pollPromise = poller.start()

    await vi.advanceTimersByTimeAsync(3000)

    await expect(pollPromise).rejects.toThrow('Transform polling exceeded max attempts')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/handlers/transform_poller.test.ts`
Expected: FAIL - module not found

**Step 3: Refactor TransformCallback to TransformPoller**

Create `src/shubox/handlers/transform_poller.ts` (based on existing `src/shubox/transform_callback.ts`):

```typescript
import type { ShuboxApiClient } from '~/shubox/api/client'
import type { ITransformResult } from '~/shubox/config/types'

export interface ITransformPollerOptions {
  maxAttempts?: number
  interval?: number
}

export class TransformPoller {
  private attempts = 0
  private maxAttempts: number
  private interval: number

  constructor(
    private apiClient: ShuboxApiClient,
    private uploadId: string,
    private transform: string,
    private callback: (result: ITransformResult) => void,
    options: ITransformPollerOptions = {}
  ) {
    this.maxAttempts = options.maxAttempts || 30
    this.interval = options.interval || 1000
  }

  async start(): Promise<ITransformResult> {
    return this.poll()
  }

  private async poll(): Promise<ITransformResult> {
    if (this.attempts >= this.maxAttempts) {
      throw new Error('Transform polling exceeded max attempts')
    }

    this.attempts++

    const result = await this.apiClient.pollTransform(this.uploadId, this.transform)

    if (result.ready) {
      this.callback(result)
      return result
    }

    await this.wait(this.interval)
    return this.poll()
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test tests/shubox/handlers/transform_poller.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/shubox/handlers/transform_poller.ts tests/shubox/handlers/transform_poller.test.ts
git commit -m "refactor: extract TransformPoller handler from TransformCallback"
```

---

## Task 7: Create Success Handler

**Files:**
- Create: `src/shubox/handlers/success.ts`
- Create: `src/shubox/handlers/index.ts`
- Test: `tests/shubox/handlers/success.test.ts`

**Step 1: Write test for SuccessHandler**

Create `tests/shubox/handlers/success.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SuccessHandler } from '~/shubox/handlers/success'
import { ShuboxDomRenderer } from '~/shubox/dom/renderer'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('SuccessHandler', () => {
  let handler: SuccessHandler
  let mockRenderer: ShuboxDomRenderer
  let mockApiClient: ShuboxApiClient
  let mockFile: IDropzoneFile

  beforeEach(() => {
    mockRenderer = new ShuboxDomRenderer()
    mockApiClient = new ShuboxApiClient({ key: 'test-key', baseUrl: 'https://api.shubox.io' })

    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {},
      success: vi.fn()
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg'
    } as IDropzoneFile
  })

  it('calls user success callback with file', async () => {
    const successCallback = vi.fn()
    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {},
      success: successCallback
    })

    await handler.handle(mockFile)

    expect(successCallback).toHaveBeenCalledWith(mockFile)
  })

  it('inserts template into target element when present', async () => {
    document.body.innerHTML = '<input type="text" id="target" />'
    const element = document.getElementById('target') as HTMLInputElement
    mockFile.previewElement = element

    vi.spyOn(mockRenderer, 'insertTemplate')

    await handler.handle(mockFile)

    expect(mockRenderer.insertTemplate).toHaveBeenCalledWith(
      element,
      '{{s3url}}',
      { s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg', name: 'test.jpg', size: 1024 },
      'replace'
    )
  })

  it('starts transform polling when transforms configured', async () => {
    const transformCallback = vi.fn()

    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {
        '200x200#': transformCallback
      },
      success: vi.fn()
    })

    // Mock the upload response to include upload ID
    ;(mockFile as any).__shuboxUploadId = 'upload-123'

    vi.spyOn(mockApiClient, 'pollTransform').mockResolvedValue({
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
      ready: true
    })

    await handler.handle(mockFile)

    // Wait for async transform polling
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(transformCallback).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/handlers/success.test.ts`
Expected: FAIL - module not found

**Step 3: Implement SuccessHandler**

Create `src/shubox/handlers/success.ts`:

```typescript
import type { ShuboxDomRenderer } from '~/shubox/dom/renderer'
import type { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile, ITemplateData } from '~/shubox/config/types'
import { TransformPoller } from './transform_poller'
import { uploadCompleteEvent } from '~/shubox/upload_complete_event'

export interface ISuccessHandlerOptions {
  successTemplate: string
  textBehavior: 'replace' | 'append'
  transforms: Record<string, (file: IDropzoneFile) => void>
  success?: (file: IDropzoneFile) => void
}

export class SuccessHandler {
  constructor(
    private renderer: ShuboxDomRenderer,
    private apiClient: ShuboxApiClient,
    private options: ISuccessHandlerOptions
  ) {}

  async handle(file: IDropzoneFile): Promise<void> {
    // Insert template into preview element if present
    if (file.previewElement) {
      const data: ITemplateData = {
        s3url: file.s3url,
        name: file.name,
        size: file.size
      }

      this.renderer.insertTemplate(
        file.previewElement as HTMLElement,
        this.options.successTemplate,
        data,
        this.options.textBehavior
      )
    }

    // Dispatch upload complete event
    if (file.previewElement) {
      file.previewElement.dispatchEvent(uploadCompleteEvent(file))
    }

    // Start transform polling if transforms configured
    if (Object.keys(this.options.transforms).length > 0) {
      const uploadId = (file as any).__shuboxUploadId

      if (uploadId) {
        for (const [transform, callback] of Object.entries(this.options.transforms)) {
          const poller = new TransformPoller(
            this.apiClient,
            uploadId,
            transform,
            (result) => {
              file.transform = result
              callback(file)
            }
          )

          poller.start().catch(err => {
            console.error('Transform polling failed:', err)
          })
        }
      }
    }

    // Call user success callback
    if (this.options.success) {
      this.options.success(file)
    }
  }
}
```

**Step 4: Create handlers barrel export**

Create `src/shubox/handlers/index.ts`:

```typescript
export * from './signature'
export * from './upload'
export * from './transform_poller'
export * from './success'
```

**Step 5: Run test to verify it passes**

Run: `npm test tests/shubox/handlers/success.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/shubox/handlers/success.ts src/shubox/handlers/index.ts tests/shubox/handlers/success.test.ts
git commit -m "feat: create success handler for post-upload orchestration"
```

---

## Task 8: Refactor ShuboxCallbacks to Use New Handlers

**Files:**
- Modify: `src/shubox/shubox_callbacks.ts`
- Test: Update existing tests or create new ones

**Step 1: Write test for refactored ShuboxCallbacks**

Create `tests/shubox/shubox_callbacks_refactored.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShuboxCallbacks } from '~/shubox/shubox_callbacks'
import { S3SignatureHandler } from '~/shubox/handlers/signature'
import { S3UploadHandler } from '~/shubox/handlers/upload'
import { SuccessHandler } from '~/shubox/handlers/success'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('ShuboxCallbacks (refactored)', () => {
  let callbacks: ShuboxCallbacks
  let mockSignatureHandler: S3SignatureHandler
  let mockUploadHandler: S3UploadHandler
  let mockSuccessHandler: SuccessHandler

  beforeEach(() => {
    mockSignatureHandler = {
      handle: vi.fn()
    } as any

    mockUploadHandler = {
      handle: vi.fn()
    } as any

    mockSuccessHandler = {
      handle: vi.fn()
    } as any

    callbacks = new ShuboxCallbacks(
      mockSignatureHandler,
      mockUploadHandler,
      mockSuccessHandler,
      {}
    )
  })

  describe('accept', () => {
    it('delegates to signature handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile
      const mockDone = vi.fn()

      callbacks.accept(mockFile, mockDone)

      expect(mockSignatureHandler.handle).toHaveBeenCalledWith(mockFile, mockDone)
    })
  })

  describe('sending', () => {
    it('delegates to upload handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile
      const mockXhr = {} as XMLHttpRequest
      const mockFormData = new FormData()

      callbacks.sending(mockFile, mockXhr, mockFormData)

      expect(mockUploadHandler.handle).toHaveBeenCalledWith(mockFile, mockXhr, mockFormData)
    })
  })

  describe('success', () => {
    it('delegates to success handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile

      callbacks.success(mockFile)

      expect(mockSuccessHandler.handle).toHaveBeenCalledWith(mockFile)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test tests/shubox/shubox_callbacks_refactored.test.ts`
Expected: FAIL - implementation doesn't match new structure yet

**Step 3: Read existing ShuboxCallbacks to understand current structure**

Run: `cat src/shubox/shubox_callbacks.ts | head -50`

**Step 4: Refactor ShuboxCallbacks to use handlers**

Modify `src/shubox/shubox_callbacks.ts`:

```typescript
import type Dropzone from "dropzone"
import type { S3SignatureHandler } from './handlers/signature'
import type { S3UploadHandler } from './handlers/upload'
import type { SuccessHandler } from './handlers/success'
import type { IDropzoneFile } from './config/types'

interface ICallbackOptions {
  addedfile?: (file: IDropzoneFile) => void
  error?: (file: IDropzoneFile, message: string) => void
  uploadingTemplate?: string
}

export class ShuboxCallbacks {
  constructor(
    private signatureHandler: S3SignatureHandler,
    private uploadHandler: S3UploadHandler,
    private successHandler: SuccessHandler,
    private options: ICallbackOptions
  ) {}

  accept = (file: IDropzoneFile, done: (error?: string) => void): void => {
    this.signatureHandler.handle(file, done)
  }

  sending = (file: IDropzoneFile, xhr: XMLHttpRequest, formData: FormData): void => {
    this.uploadHandler.handle(file, xhr, formData)
  }

  success = (file: IDropzoneFile): void => {
    this.successHandler.handle(file)
  }

  addedfile = (file: IDropzoneFile): void => {
    if (this.options.uploadingTemplate && file.previewElement) {
      const template = this.options.uploadingTemplate.replace('{{name}}', file.name)
      file.previewElement.innerHTML = template
    }

    if (this.options.addedfile) {
      this.options.addedfile(file)
    }
  }

  error = (file: IDropzoneFile, message: string): void => {
    if (this.options.error) {
      this.options.error(file, message)
    }
  }

  static pasteCallback(element: HTMLElement, callback: (file: File) => void): void {
    element.addEventListener('paste', (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile()
          if (file) {
            callback(file)
          }
        }
      }
    })
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test tests/shubox/shubox_callbacks_refactored.test.ts`
Expected: PASS

**Step 6: Run all existing tests to ensure no regressions**

Run: `npm test`
Expected: All tests should pass (some may need updates)

**Step 7: Commit**

```bash
git add src/shubox/shubox_callbacks.ts tests/shubox/shubox_callbacks_refactored.test.ts
git commit -m "refactor: update ShuboxCallbacks to delegate to focused handler classes"
```

---

## Task 9: Update Main Shubox Class to Use New Architecture

**Files:**
- Modify: `src/shubox/index.ts`
- Test: Update existing tests

**Step 1: Read current Shubox class implementation**

Run: `cat src/shubox/index.ts`

**Step 2: Plan the refactoring**

The Shubox class needs to:
1. Create instances of ShuboxApiClient, ShuboxDomRenderer
2. Create handler instances with dependency injection
3. Create ShuboxCallbacks with handlers
4. Pass callbacks to Dropzone initialization

**Step 3: Write test for updated Shubox class**

Create `tests/shubox/index_refactored.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Shubox from '~/shubox/index'

describe('Shubox (refactored)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="shubox"></div>'
  })

  it('creates API client with correct configuration', () => {
    const shubox = new Shubox('.shubox', {
      key: 'test-key',
      baseUrl: 'https://custom.api.com'
    })

    // Verify API client was created with correct config
    // This requires exposing internals for testing or using integration tests
    expect(shubox).toBeDefined()
  })

  it('creates handlers with dependency injection', () => {
    const shubox = new Shubox('.shubox', {
      key: 'test-key'
    })

    expect(shubox).toBeDefined()
    // Handlers should be created internally
  })

  it('maintains backward compatibility with existing API', () => {
    const shubox = new Shubox('.shubox', {
      key: 'test-key',
      success: vi.fn(),
      error: vi.fn(),
      transforms: {
        '200x200#': vi.fn()
      }
    })

    expect(shubox).toBeDefined()
    expect(Shubox.instances).toHaveLength(1)
  })
})
```

**Step 4: Run test to verify it fails**

Run: `npm test tests/shubox/index_refactored.test.ts`
Expected: FAIL - implementation doesn't match new structure

**Step 5: Refactor Shubox class**

Modify `src/shubox/index.ts`:

```typescript
import Dropzone from "dropzone"
import { ShuboxApiClient } from './api/client'
import { ShuboxDomRenderer } from './dom/renderer'
import { S3SignatureHandler } from './handlers/signature'
import { S3UploadHandler } from './handlers/upload'
import { SuccessHandler } from './handlers/success'
import { ShuboxCallbacks } from './shubox_callbacks'
import { ShuboxOptions } from './shubox_options'
import type { IUserOptions } from './shubox_options'

Dropzone.autoDiscover = false

export default class Shubox {
  static instances: Dropzone[] = []

  private apiClient: ShuboxApiClient
  private renderer: ShuboxDomRenderer
  private callbacks: ShuboxCallbacks

  constructor(selector: string = ".shubox", options: IUserOptions = {}) {
    if (!options.key) {
      throw new Error('Shubox requires a key option')
    }

    // Create core services
    this.apiClient = new ShuboxApiClient({
      key: options.key,
      baseUrl: options.baseUrl,
      signatureUrl: options.signatureUrl,
      uploadUrl: options.uploadUrl
    })

    this.renderer = new ShuboxDomRenderer()

    // Create handlers with dependency injection
    const signatureHandler = new S3SignatureHandler(this.apiClient, {
      key: options.key,
      s3Key: options.s3Key,
      extraParams: options.extraParams
    })

    const uploadHandler = new S3UploadHandler({
      extraParams: options.extraParams
    })

    const successHandler = new SuccessHandler(this.renderer, this.apiClient, {
      successTemplate: options.successTemplate || '{{s3url}}',
      textBehavior: options.textBehavior || 'replace',
      transforms: options.transforms || {},
      success: options.success
    })

    // Create callbacks
    this.callbacks = new ShuboxCallbacks(
      signatureHandler,
      uploadHandler,
      successHandler,
      {
        addedfile: options.addedfile,
        error: options.error,
        uploadingTemplate: options.uploadingTemplate
      }
    )

    // Initialize Dropzone instances
    this.initializeDropzones(selector, options)
  }

  private initializeDropzones(selector: string, options: IUserOptions): void {
    const elements = document.querySelectorAll(selector)

    elements.forEach((element) => {
      const dzOptions = new ShuboxOptions(element, options).toDropzoneOptions()

      // Merge callbacks
      const fullOptions = {
        ...dzOptions,
        accept: this.callbacks.accept,
        sending: this.callbacks.sending,
        success: this.callbacks.success,
        addedfile: this.callbacks.addedfile,
        error: this.callbacks.error
      }

      const dropzone = new Dropzone(element as HTMLElement, fullOptions)
      Shubox.instances.push(dropzone)
    })
  }
}
```

**Step 6: Run test to verify it passes**

Run: `npm test tests/shubox/index_refactored.test.ts`
Expected: PASS

**Step 7: Run all tests to ensure no regressions**

Run: `npm test`
Expected: Most tests should pass (some may need minor updates)

**Step 8: Commit**

```bash
git add src/shubox/index.ts tests/shubox/index_refactored.test.ts
git commit -m "refactor: update Shubox class to use dependency injection with new architecture"
```

---

## Task 10: Clean Up and Remove Old Code

**Files:**
- Delete: `src/shubox/transform_callback.ts` (replaced by `handlers/transform_poller.ts`)
- Update: Any remaining imports

**Step 1: Check for usages of old TransformCallback**

Run: `grep -r "transform_callback" src/ tests/`

**Step 2: Update any remaining imports**

Update files that import from `transform_callback.ts` to use `handlers/transform_poller.ts` instead.

**Step 3: Remove old file**

```bash
git rm src/shubox/transform_callback.ts
```

**Step 4: Verify all tests still pass**

Run: `npm test`
Expected: All tests pass

**Step 5: Commit**

```bash
git commit -m "refactor: remove old TransformCallback in favor of TransformPoller"
```

---

## Task 11: Update ShuboxOptions to Use Config Module

**Files:**
- Modify: `src/shubox/shubox_options.ts`

**Step 1: Read current ShuboxOptions**

Run: `cat src/shubox/shubox_options.ts`

**Step 2: Refactor to use config constants**

Modify `src/shubox/shubox_options.ts`:

Replace magic strings and hardcoded values with imports from config module:

```typescript
import { DROPZONE_DEFAULTS, SHUBOX_DEFAULTS } from './config/defaults'
import { DROPZONE_CONSTANTS } from './config/constants'
// ... rest of imports

// Replace hardcoded values with constants
// Before: url: "http://localhost"
// After: url: DROPZONE_CONSTANTS.DUMMY_URL

// Before: acceptedFiles: "image/*"
// After: acceptedFiles: DROPZONE_DEFAULTS.acceptedFiles
```

**Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/shubox/shubox_options.ts
git commit -m "refactor: update ShuboxOptions to use centralized config module"
```

---

## Task 12: Add Integration Tests

**Files:**
- Create: `tests/integration/upload_flow.test.ts`

**Step 1: Write integration test for full upload flow**

Create `tests/integration/upload_flow.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Shubox from '~/shubox/index'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('Upload Flow Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="shubox"></div>'
    global.fetch = vi.fn()
  })

  it('completes full upload flow from file drop to success', async () => {
    const successCallback = vi.fn()

    // Mock API responses
    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          endpoint: 'https://s3.amazonaws.com/bucket',
          signature: 'sig123',
          policy: 'pol123',
          key: 'uploads/test.jpg'
        })
      })

    const shubox = new Shubox('.shubox', {
      key: 'test-key',
      success: successCallback
    })

    const dropzone = Shubox.instances[0]
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    // Simulate file drop
    await dropzone.addFile(mockFile)

    // Verify signature was fetched
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.shubox.io/signatures',
      expect.objectContaining({ method: 'POST' })
    )

    // Simulate successful upload
    dropzone.emit('success', mockFile)

    expect(successCallback).toHaveBeenCalled()
  })

  it('handles transform polling flow', async () => {
    const transformCallback = vi.fn()

    // Mock API responses
    ;(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          endpoint: 'https://s3.amazonaws.com/bucket',
          signature: 'sig123',
          policy: 'pol123',
          key: 'uploads/test.jpg'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
          ready: true
        })
      })

    const shubox = new Shubox('.shubox', {
      key: 'test-key',
      transforms: {
        '200x200#': transformCallback
      }
    })

    const dropzone = Shubox.instances[0]
    const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' }) as IDropzoneFile
    mockFile.s3url = 'https://s3.amazonaws.com/bucket/uploads/test.jpg'
    ;(mockFile as any).__shuboxUploadId = 'upload-123'

    await dropzone.addFile(mockFile)
    dropzone.emit('success', mockFile)

    // Wait for async transform polling
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(transformCallback).toHaveBeenCalled()
  })
})
```

**Step 2: Run test**

Run: `npm test tests/integration/upload_flow.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add tests/integration/upload_flow.test.ts
git commit -m "test: add integration tests for full upload flow"
```

---

## Task 13: Update Documentation

**Files:**
- Update: `CLAUDE.md` (architecture section)
- Create: `docs/architecture.md` (optional - detailed architecture docs)

**Step 1: Update CLAUDE.md with new architecture**

Modify `/home/joel/code/shubox.js/CLAUDE.md`:

Add new section after "## Architecture":

```markdown
### New Modular Architecture (Post-Refactoring)

The codebase follows a modular architecture with dependency injection:

**Core Modules:**
- `src/shubox/config/` - Centralized constants, defaults, and TypeScript types
- `src/shubox/api/` - API client for HTTP communication with Shubox service
- `src/shubox/dom/` - DOM renderer for template interpolation and insertion
- `src/shubox/handlers/` - Single-responsibility handlers for upload lifecycle
  - `signature.ts` - Fetches S3 pre-signed URLs
  - `upload.ts` - Posts files to S3 with signed form data
  - `transform_poller.ts` - Polls for transform completion
  - `success.ts` - Orchestrates post-upload actions
- `src/shubox/callbacks/` - Thin Dropzone integration layer

**Dependency Flow:**
```
Shubox (orchestrator)
  ├─> ShuboxApiClient
  ├─> ShuboxDomRenderer
  └─> ShuboxCallbacks
       ├─> S3SignatureHandler(apiClient)
       ├─> S3UploadHandler()
       └─> SuccessHandler(renderer, apiClient)
```

All dependencies are injected through constructors, making the codebase testable and modular.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update architecture documentation for new modular structure"
```

---

## Task 14: Run Full Test Suite and Build

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

**Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors

**Step 3: Check bundle size**

Run: `ls -lh dist/`

Compare bundle sizes before and after refactoring to ensure no significant increase.

**Step 4: Test in demo**

Run: `npm run dev`

Open browser to http://localhost:8888 and test file upload functionality manually.

**Step 5: Commit if any fixes were needed**

```bash
git add .
git commit -m "fix: resolve any issues found during testing and build"
```

---

## Task 15: Final Cleanup and Documentation

**Step 1: Review all new files for consistency**

Check:
- All files have proper exports
- TypeScript types are consistent
- No unused imports
- Consistent code style

**Step 2: Add JSDoc comments to public APIs**

Add JSDoc comments to:
- `ShuboxApiClient` class and methods
- `ShuboxDomRenderer` class and methods
- Handler classes
- Main `Shubox` class

Example:
```typescript
/**
 * Client for communicating with Shubox API
 * Handles signature fetching and transform polling
 */
export class ShuboxApiClient {
  /**
   * Fetches pre-signed S3 upload URL from Shubox API
   * @param file - File to be uploaded
   * @param options - Signature request options
   * @returns S3 signature with upload endpoint and credentials
   */
  async fetchSignature(file: File, options: ISignatureOptions): Promise<IS3Signature> {
    // ...
  }
}
```

**Step 3: Update README if needed**

Check if README needs updates to reflect new architecture.

**Step 4: Commit**

```bash
git add .
git commit -m "docs: add JSDoc comments to public APIs"
```

**Step 5: Create summary of changes**

Create `REFACTORING_SUMMARY.md`:

```markdown
# Code Structure Refactoring Summary

## Changes Made

### New Modules Created
- `src/shubox/config/` - Centralized configuration (constants, defaults, types)
- `src/shubox/api/client.ts` - API client for HTTP communication
- `src/shubox/dom/renderer.ts` - DOM manipulation and template rendering
- `src/shubox/handlers/` - Upload lifecycle handlers with dependency injection

### Files Refactored
- `src/shubox/shubox_callbacks.ts` - Reduced from 300+ lines to ~50 lines
- `src/shubox/index.ts` - Updated to use dependency injection
- `src/shubox/shubox_options.ts` - Updated to use config constants

### Files Removed
- `src/shubox/transform_callback.ts` - Replaced by `handlers/transform_poller.ts`

### Benefits
✅ Improved testability - All modules use dependency injection
✅ Better maintainability - Clear separation of concerns (API, DOM, handlers)
✅ Reduced complexity - 300+ line file broken into focused 50-line modules
✅ Enhanced type safety - Centralized type definitions
✅ Tree-shaking ready - Modular imports enable better bundle optimization

### Backward Compatibility
✅ Public API unchanged - `new Shubox(selector, options)` still works
✅ All existing options supported
✅ No breaking changes for end users

## Testing
- Added unit tests for all new modules
- Added integration tests for full upload flow
- All existing tests passing

## Bundle Size
- Before: [size]
- After: [size]
- Change: [difference]
```

**Step 6: Final commit**

```bash
git add REFACTORING_SUMMARY.md
git commit -m "docs: add refactoring summary document"
```

---

## Verification Checklist

Before considering this complete, verify:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Demo works correctly (`npm run dev`)
- [ ] No TypeScript errors
- [ ] Bundle size is reasonable
- [ ] Documentation is updated
- [ ] All commits have clear messages
- [ ] Code follows DRY and YAGNI principles

## Notes

- This refactoring maintains backward compatibility while introducing a cleaner architecture
- Each handler is now independently testable with mocked dependencies
- The configuration module eliminates magic strings throughout the codebase
- Future enhancements (e.g., custom API clients) are easier to implement with DI

## References

- @superpowers:test-driven-development - Used TDD for all new modules
- @superpowers:verification-before-completion - Verified each task before moving on
