# Code Structure Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. REQUIRED TEST BEFORE COMMITTING CODE: test upload of sample image ./tmp/huh.jpg at http://localhost:8888/demo/index.html with playwright and ensure that it works.

**Goal:** Refactor Shubox.js into a modular architecture with clear separation of concerns (API, DOM, configuration) and dependency injection for improved maintainability, testability, and tree-shaking.

**Architecture:** Extract the 300+ line ShuboxCallbacks into focused single-responsibility modules: ShuboxApiClient for HTTP calls, ShuboxDomRenderer for DOM manipulation, ShuboxConfig for constants, and handler classes for each upload lifecycle phase. Use dependency injection throughout.

**Tech Stack:** TypeScript, Vitest, Dropzone.js

---

## Task 1: Create ShuboxConfig Module

**Files:**

- Create: `src/shubox/config.ts`
- Test: `tests/shubox/config.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { ShuboxConfig } from '../src/shubox/config';

describe('ShuboxConfig', () => {
  test('exports DEFAULT_TIMEOUT constant', () => {
    expect(ShuboxConfig.DEFAULT_TIMEOUT).toBe(30000);
  });

  test('exports DEFAULT_RETRY_ATTEMPTS constant', () => {
    expect(ShuboxConfig.DEFAULT_RETRY_ATTEMPTS).toBe(3);
  });

  test('exports REPLACEABLE_VARIABLES array', () => {
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('height');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('width');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('name');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('s3');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('s3url');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('size');
    expect(ShuboxConfig.REPLACEABLE_VARIABLES).toContain('type');
  });

  test('exports DEFAULT_ACCEPTED_FILES constant', () => {
    expect(ShuboxConfig.DEFAULT_ACCEPTED_FILES).toBe('image/*');
  });

  test('exports DEFAULT_TEXT_BEHAVIOR constant', () => {
    expect(ShuboxConfig.DEFAULT_TEXT_BEHAVIOR).toBe('replace');
  });

  test('exports DEFAULT_SUCCESS_TEMPLATE constant', () => {
    expect(ShuboxConfig.DEFAULT_SUCCESS_TEMPLATE).toBe('{{s3url}}');
  });

  test('exports DEFAULT_UPLOADING_TEMPLATE constant', () => {
    expect(ShuboxConfig.DEFAULT_UPLOADING_TEMPLATE).toBe('');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/config.test.ts
```

Expected output: Multiple failures like "Cannot find module '../src/shubox/config'"

**Step 3: Write minimal implementation**

```typescript
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
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/config.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/config.ts tests/shubox/config.test.ts
git commit -m "feat: create ShuboxConfig module for configuration constants"
```

---

## Task 2: Create ShuboxDomRenderer Module - Part 1 (CSS Classes)

**Files:**

- Create: `src/shubox/dom_renderer.ts`
- Test: `tests/shubox/dom_renderer.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach } from 'vitest';
import { ShuboxDomRenderer } from '../src/shubox/dom_renderer';
import { setupJsDom } from './test_helpers';

describe('ShuboxDomRenderer', () => {
  let element: HTMLElement;
  let renderer: ShuboxDomRenderer;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('div');
    document.body.appendChild(element);
    renderer = new ShuboxDomRenderer(element);
  });

  describe('CSS class management', () => {
    test('setUploadingState adds shubox-uploading class', () => {
      renderer.setUploadingState();
      expect(element.classList.contains('shubox-uploading')).toBe(true);
    });

    test('setSuccessState adds shubox-success class and removes shubox-uploading', () => {
      element.classList.add('shubox-uploading');
      renderer.setSuccessState();
      expect(element.classList.contains('shubox-success')).toBe(true);
      expect(element.classList.contains('shubox-uploading')).toBe(false);
    });

    test('setErrorState adds shubox-error class and removes shubox-uploading', () => {
      element.classList.add('shubox-uploading');
      renderer.setErrorState();
      expect(element.classList.contains('shubox-error')).toBe(true);
      expect(element.classList.contains('shubox-uploading')).toBe(false);
    });

    test('clearErrorState removes shubox-error class', () => {
      element.classList.add('shubox-error');
      renderer.clearErrorState();
      expect(element.classList.contains('shubox-error')).toBe(false);
    });

    test('clearSuccessState removes shubox-success class', () => {
      element.classList.add('shubox-success');
      renderer.clearSuccessState();
      expect(element.classList.contains('shubox-success')).toBe(false);
    });

    test('setOfflineState adds shubox-offline class', () => {
      renderer.setOfflineState();
      expect(element.classList.contains('shubox-offline')).toBe(true);
    });

    test('clearOfflineState removes shubox-offline class', () => {
      element.classList.add('shubox-offline');
      renderer.clearOfflineState();
      expect(element.classList.contains('shubox-offline')).toBe(false);
    });
  });

  describe('data attribute management', () => {
    test('setProgress updates data-shubox-progress attribute', () => {
      renderer.setProgress(50);
      expect(element.dataset.shuboxProgress).toBe('50');
    });

    test('clearProgress removes data-shubox-progress attribute', () => {
      element.dataset.shuboxProgress = '50';
      renderer.clearProgress();
      expect(element.dataset.shuboxProgress).toBeUndefined();
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: "Cannot find module '../src/shubox/dom_renderer'"

**Step 3: Write minimal implementation**

```typescript
// src/shubox/dom_renderer.ts
export class ShuboxDomRenderer {
  constructor(private element: HTMLElement) {}

  setUploadingState(): void {
    this.element.classList.add('shubox-uploading');
  }

  setSuccessState(): void {
    this.element.classList.add('shubox-success');
    this.element.classList.remove('shubox-uploading');
  }

  setErrorState(): void {
    this.element.classList.add('shubox-error');
    this.element.classList.remove('shubox-uploading');
  }

  clearErrorState(): void {
    this.element.classList.remove('shubox-error');
  }

  clearSuccessState(): void {
    this.element.classList.remove('shubox-success');
  }

  setOfflineState(): void {
    this.element.classList.add('shubox-offline');
  }

  clearOfflineState(): void {
    this.element.classList.remove('shubox-offline');
  }

  setProgress(progress: number): void {
    this.element.dataset.shuboxProgress = String(progress);
  }

  clearProgress(): void {
    delete this.element.dataset.shuboxProgress;
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/dom_renderer.ts tests/shubox/dom_renderer.test.ts
git commit -m "feat: create ShuboxDomRenderer module for CSS class and data attribute management"
```

---

## Task 3: Extend ShuboxDomRenderer - Form Value Updates

**Files:**

- Modify: `src/shubox/dom_renderer.ts`
- Modify: `tests/shubox/dom_renderer.test.ts`

**Step 1: Write the failing test**

Add these tests to `tests/shubox/dom_renderer.test.ts`:

```typescript
describe('form value updates', () => {
  test('updateFormValue replaces INPUT value with template interpolation', () => {
    const input = document.createElement('input');
    input.value = '';
    element.appendChild(input);

    renderer.updateFormValue(input, 'https://example.com/image.jpg', [
      'height',
      'width',
      'name',
      's3',
      's3url',
      'size',
      'type',
    ]);

    expect(input.value).toBe('https://example.com/image.jpg');
  });

  test('updateFormValue with textBehavior append adds to TEXTAREA', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'existing text';
    element.appendChild(textarea);

    renderer.updateFormValue(textarea, ' new value', ['s3url'], 'append');

    expect(textarea.value).toBe('existing text new value');
  });

  test('updateFormValue interpolates template variables correctly', () => {
    const input = document.createElement('input');
    element.appendChild(input);

    const template = '{{s3url}} - {{size}} bytes';
    renderer.updateFormValue(input, template, ['s3url', 'size'], 'replace', {
      s3url: 'https://example.com/image.jpg',
      size: '1024',
    });

    expect(input.value).toBe('https://example.com/image.jpg - 1024 bytes');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: Tests fail with "updateFormValue is not a function"

**Step 3: Write minimal implementation**

Add these methods to `src/shubox/dom_renderer.ts`:

```typescript
  updateFormValue(
    element: HTMLElement,
    value: string,
    replaceables: string[],
    textBehavior: string = 'replace',
    interpolations: Record<string, string> = {}
  ): void {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      return;
    }

    // Interpolate template variables
    let interpolatedValue = value;
    for (const [key, val] of Object.entries(interpolations)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      interpolatedValue = interpolatedValue.replace(regex, val);
    }

    if (textBehavior === 'append') {
      element.value += interpolatedValue;
    } else {
      element.value = interpolatedValue;
    }
  }
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/dom_renderer.ts tests/shubox/dom_renderer.test.ts
git commit -m "feat: add form value update and template interpolation to ShuboxDomRenderer"
```

---

## Task 4: Create ShuboxApiClient Module

**Files:**

- Create: `src/shubox/api_client.ts`
- Test: `tests/shubox/api_client.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxApiClient } from '../src/shubox/api_client';
import { Shubox } from '../src/shubox/index';
import { setupJsDom } from './test_helpers';

describe('ShuboxApiClient', () => {
  let element: HTMLElement;
  let shubox: Shubox;
  let client: ShuboxApiClient;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);

    shubox = new Shubox({
      key: 'test-key',
      element,
    });

    client = new ShuboxApiClient(shubox);
  });

  describe('signature fetching', () => {
    test('fetchSignature returns signature response with required fields', async () => {
      const mockSignature = {
        key: 'uploads/test.jpg',
        policy: 'encoded-policy',
        signature: 'signature-hash',
        aws_endpoint: 'https://s3.amazonaws.com/bucket',
        acl: 'public-read',
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSignature),
        } as Response),
      );

      const file = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      };

      const result = await client.fetchSignature(file, {});

      expect(result).toEqual(mockSignature);
      expect(global.fetch).toHaveBeenCalled();
    });

    test('fetchSignature throws error on failed response', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
        } as Response),
      );

      const file = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      };

      await expect(client.fetchSignature(file, {})).rejects.toThrow();
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/api_client.test.ts
```

Expected output: "Cannot find module '../src/shubox/api_client'"

**Step 3: Write minimal implementation**

```typescript
// src/shubox/api_client.ts
import type { Shubox } from './index';
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
    options: FetchSignatureOptions = {},
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
      },
    );

    if (!response.ok) {
      throw new Error(`Signature fetch failed: ${response.statusText}`);
    }

    return response.json() as Promise<SignatureResponse>;
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/api_client.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/api_client.ts tests/shubox/api_client.test.ts
git commit -m "feat: create ShuboxApiClient module for API communication"
```

---

## Task 5: Create ShuboxErrorHandler Module

**Files:**

- Create: `src/shubox/error_handler.ts`
- Test: `tests/shubox/error_handler.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxErrorHandler } from '../src/shubox/error_handler';
import { NetworkError, TimeoutError, OfflineError } from '../src/shubox/errors';
import { setupJsDom } from './test_helpers';

describe('ShuboxErrorHandler', () => {
  let element: HTMLElement;
  let handler: ShuboxErrorHandler;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);
    handler = new ShuboxErrorHandler(element);
  });

  describe('recoverable error detection', () => {
    test('isRecoverableError returns true for NetworkError', () => {
      const error = new NetworkError('Connection failed');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for TimeoutError', () => {
      const error = new TimeoutError('Request timeout');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for OfflineError', () => {
      const error = new OfflineError('No connection');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns false for generic Error', () => {
      const error = new Error('Some error');
      expect(handler.isRecoverableError(error)).toBe(false);
    });
  });

  describe('retry scheduling', () => {
    test('calculateBackoffDelay returns exponential backoff', () => {
      expect(handler.calculateBackoffDelay(1)).toBe(1000); // 2^0 * 1000
      expect(handler.calculateBackoffDelay(2)).toBe(2000); // 2^1 * 1000
      expect(handler.calculateBackoffDelay(3)).toBe(4000); // 2^2 * 1000
      expect(handler.calculateBackoffDelay(4)).toBe(8000); // 2^3 * 1000
    });
  });

  describe('error event dispatching', () => {
    test('dispatchErrorEvent dispatches shubox:error event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');
      const error = new Error('Test error');

      handler.dispatchErrorEvent(error);

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:error');
    });

    test('dispatchTimeoutEvent dispatches shubox:timeout event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');

      handler.dispatchTimeoutEvent();

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:timeout');
    });

    test('dispatchRetryEvent dispatches shubox:retry:attempt event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');

      handler.dispatchRetryEvent(1, 1000);

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:retry:attempt');
      expect(event.detail.attempt).toBe(1);
      expect(event.detail.delay).toBe(1000);
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/error_handler.test.ts
```

Expected output: "Cannot find module '../src/shubox/error_handler'"

**Step 3: Write minimal implementation**

```typescript
// src/shubox/error_handler.ts
import type { Dropzone } from 'dropzone';
import { NetworkError, TimeoutError, OfflineError, ShuboxError } from './errors';
import { dispatchShuboxEvent } from './events';

export class ShuboxErrorHandler {
  constructor(private element: HTMLElement) {}

  isRecoverableError(error: Error): boolean {
    return (
      error instanceof NetworkError ||
      error instanceof TimeoutError ||
      error instanceof OfflineError
    );
  }

  calculateBackoffDelay(attemptNumber: number): number {
    return Math.pow(2, attemptNumber - 1) * 1000;
  }

  dispatchErrorEvent(error: Error): void {
    const detail =
      error instanceof ShuboxError
        ? {
            code: error.code,
            message: error.message,
          }
        : { message: error.message };

    dispatchShuboxEvent(this.element, 'shubox:error', detail);
  }

  dispatchTimeoutEvent(): void {
    dispatchShuboxEvent(this.element, 'shubox:timeout', {});
  }

  dispatchRetryEvent(attemptNumber: number, delay: number): void {
    dispatchShuboxEvent(this.element, 'shubox:retry:attempt', {
      attempt: attemptNumber,
      delay,
    });
  }

  dispatchRecoveredEvent(): void {
    dispatchShuboxEvent(this.element, 'shubox:recovered', {});
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/error_handler.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/error_handler.ts tests/shubox/error_handler.test.ts
git commit -m "feat: create ShuboxErrorHandler module for error handling and retry logic"
```

---

## Task 6: Create ShuboxResourceManager Module

**Files:**

- Create: `src/shubox/resource_manager.ts`
- Test: `tests/shubox/resource_manager.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxResourceManager } from '../src/shubox/resource_manager';
import { setupJsDom } from './test_helpers';

describe('ShuboxResourceManager', () => {
  let element: HTMLElement;
  let manager: ShuboxResourceManager;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);
    manager = new ShuboxResourceManager(element);
  });

  describe('cleanup', () => {
    test('cleanupFile clears retry timeout', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
        _shuboxRetryCount: 2,
      };

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      manager.cleanupFile(file);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(file._shuboxRetryTimeout).toBeUndefined();
    });

    test('cleanupFile resets retry count', () => {
      const file: any = {
        _shuboxRetryCount: 3,
      };

      manager.cleanupFile(file);

      expect(file._shuboxRetryCount).toBeUndefined();
    });

    test('cleanupFile removes error class', () => {
      element.classList.add('shubox-error');

      const file: any = {};
      manager.cleanupFile(file);

      expect(element.classList.contains('shubox-error')).toBe(false);
    });
  });

  describe('progress tracking', () => {
    test('resetProgress clears progress data attribute', () => {
      element.dataset.shuboxProgress = '50';

      const file: any = {};
      manager.resetProgress(file);

      expect(element.dataset.shuboxProgress).toBeUndefined();
    });
  });

  describe('lifecycle callbacks', () => {
    test('onFileCanceled cleans up file', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
      };

      const cleanupSpy = vi.spyOn(manager, 'cleanupFile');
      manager.onFileCanceled(file);

      expect(cleanupSpy).toHaveBeenCalledWith(file);
    });

    test('onFileRemoved cleans up file', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
      };

      const cleanupSpy = vi.spyOn(manager, 'cleanupFile');
      manager.onFileRemoved(file);

      expect(cleanupSpy).toHaveBeenCalledWith(file);
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/resource_manager.test.ts
```

Expected output: "Cannot find module '../src/shubox/resource_manager'"

**Step 3: Write minimal implementation**

```typescript
// src/shubox/resource_manager.ts
export class ShuboxResourceManager {
  constructor(private element: HTMLElement) {}

  cleanupFile(file: any): void {
    // Clear retry timeout
    if (file._shuboxRetryTimeout) {
      clearTimeout(file._shuboxRetryTimeout);
      delete file._shuboxRetryTimeout;
    }

    // Reset retry count
    delete file._shuboxRetryCount;

    // Remove error class
    this.element.classList.remove('shubox-error');
  }

  resetProgress(file: any): void {
    delete this.element.dataset.shuboxProgress;
  }

  onFileCanceled(file: any): void {
    this.cleanupFile(file);
  }

  onFileRemoved(file: any): void {
    this.cleanupFile(file);
  }

  onQueueComplete(): void {
    // No action needed in basic implementation
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/resource_manager.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/resource_manager.ts tests/shubox/resource_manager.test.ts
git commit -m "feat: create ShuboxResourceManager module for lifecycle and cleanup management"
```

---

## Task 7: Create ShuboxTransformManager Module

**Files:**

- Create: `src/shubox/transform_manager.ts`
- Test: `tests/shubox/transform_manager.test.ts`

**Step 1: Write the failing test**

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxTransformManager } from '../src/shubox/transform_manager';
import { setupJsDom } from './test_helpers';

describe('ShuboxTransformManager', () => {
  let element: HTMLElement;
  let manager: ShuboxTransformManager;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);
    manager = new ShuboxTransformManager();
  });

  describe('transform processing', () => {
    test('hasTransforms returns false when no transforms configured', () => {
      expect(manager.hasTransforms(undefined)).toBe(false);
      expect(manager.hasTransforms(null as any)).toBe(false);
      expect(manager.hasTransforms({})).toBe(false);
    });

    test('hasTransforms returns true when transforms exist', () => {
      const transforms = {
        thumbnail: { width: 100, height: 100 },
      };
      expect(manager.hasTransforms(transforms)).toBe(true);
    });

    test('getTransformVariants returns variant names', () => {
      const transforms = {
        thumbnail: { width: 100, height: 100 },
        medium: { width: 500, height: 500 },
      };
      const variants = manager.getTransformVariants(transforms);
      expect(variants).toContain('thumbnail');
      expect(variants).toContain('medium');
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/transform_manager.test.ts
```

Expected output: "Cannot find module '../src/shubox/transform_manager'"

**Step 3: Write minimal implementation**

```typescript
// src/shubox/transform_manager.ts
import type { TransformConfig } from './types';

export class ShuboxTransformManager {
  hasTransforms(transforms: Record<string, TransformConfig> | undefined): boolean {
    return !!transforms && Object.keys(transforms).length > 0;
  }

  getTransformVariants(transforms: Record<string, TransformConfig>): string[] {
    return Object.keys(transforms);
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/transform_manager.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/transform_manager.ts tests/shubox/transform_manager.test.ts
git commit -m "feat: create ShuboxTransformManager module for image transform handling"
```

---

## Task 8: Refactor ShuboxCallbacks to Use New Modules - Part 1

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`
- Modify: `tests/shubox/uploading_template.test.ts`

**Step 1: Update ShuboxCallbacks imports**

Replace the top of `shubox_callbacks.ts` with:

```typescript
import type Dropzone from 'dropzone';
import type { Shubox } from './index';
import type { ShuboxDropzoneFile, IShuboxFile } from './types';
import { dispatchShuboxEvent } from './events';
import { uploadCompleteEvent } from './upload_complete_event';
import { TransformCallback } from './transform_callback';
import { ShuboxConfig } from './config';
import { ShuboxDomRenderer } from './dom_renderer';
import { ShuboxApiClient } from './api_client';
import { ShuboxErrorHandler } from './error_handler';
import { ShuboxResourceManager } from './resource_manager';
import { ShuboxTransformManager } from './transform_manager';
import { OfflineError, NetworkError, TimeoutError } from './errors';
```

**Step 2: Update ShuboxCallbacks constructor**

Replace the constructor with:

```typescript
  constructor(shubox: Shubox, instances: Dropzone[]) {
    this.shubox = shubox;
    this.instances = instances;
    this.replaceable = ShuboxConfig.REPLACEABLE_VARIABLES;
    this.domRenderer = new ShuboxDomRenderer(shubox.element);
    this.apiClient = new ShuboxApiClient(shubox);
    this.errorHandler = new ShuboxErrorHandler(shubox.element);
    this.resourceManager = new ShuboxResourceManager(shubox.element);
    this.transformManager = new ShuboxTransformManager();
  }

  private domRenderer: ShuboxDomRenderer;
  private apiClient: ShuboxApiClient;
  private errorHandler: ShuboxErrorHandler;
  private resourceManager: ShuboxResourceManager;
  private transformManager: ShuboxTransformManager;
```

**Step 3: Run existing tests to ensure nothing breaks**

```bash
npm test
```

Expected output: All tests pass (refactoring is internal only at this point)

**Step 4: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: integrate new modules into ShuboxCallbacks"
```

---

## Task 9: Migrate accept() Callback to Use ShuboxApiClient

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Update accept callback**

Replace the `accept` method with:

```typescript
  async accept(
    file: ShuboxDropzoneFile,
    done: (error?: string | Error) => void
  ): Promise<void> {
    const self = this;

    // Check offline state
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineError = new OfflineError(
        'You are offline. Uploads will resume when back online.'
      );
      self.shubox.callbacks.error(file, offlineError);
      return;
    }

    try {
      // Use ShuboxApiClient for signature fetching
      const signature = await self.apiClient.fetchSignature(
        {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        {
          s3Key: self.shubox.options.s3Key,
          retryAttempts: self.shubox.options.retryAttempts,
          timeout: self.shubox.options.timeout,
        }
      );

      if ((signature as any).error) {
        self.shubox.callbacks.error(file, (signature as any).error);
        return;
      }

      // Update Dropzone URLs with signature
      self.instances.forEach((dz) => {
        dz.options.url = signature.aws_endpoint;
      });

      // Attach signature to file
      file.postData = signature;
      file.s3 = signature.key;

      done();
    } catch (err) {
      self.shubox.callbacks.error(file, err as Error);
    }
  }
```

**Step 2: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 3: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: migrate accept callback to use ShuboxApiClient"
```

---

## Task 10: Migrate error() Callback to Use ShuboxErrorHandler

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Update error callback**

Replace the `error` method with:

```typescript
  error(
    file: ShuboxDropzoneFile,
    message: string | Error,
    xhr?: XMLHttpRequest
  ): void {
    const self = this;
    const error = message instanceof Error ? message : new Error(String(message));

    // Initialize retry count
    if (file._shuboxRetryCount === undefined) {
      file._shuboxRetryCount = 0;
    }

    // Determine if recoverable
    const isRecoverable = self.errorHandler.isRecoverableError(error);
    const maxRetries = self.shubox.options.retryAttempts || 3;
    const shouldRetry = isRecoverable && file._shuboxRetryCount < maxRetries;

    // Dispatch error-specific events
    if (error instanceof TimeoutError) {
      self.errorHandler.dispatchTimeoutEvent();
    }

    // Handle retry
    if (shouldRetry) {
      file._shuboxRetryCount++;

      const delay = self.errorHandler.calculateBackoffDelay(file._shuboxRetryCount);
      self.errorHandler.dispatchRetryEvent(file._shuboxRetryCount, delay);

      file.status = Dropzone.QUEUED;
      self.domRenderer.clearErrorState();

      file._shuboxRetryTimeout = setTimeout(() => {
        const dropzone = self.instances.find((dz) =>
          Array.from(dz.files).some((f: any) => f === file)
        );
        if (dropzone) {
          dropzone.processFile(file);
        }
      }, delay);

      return;
    }

    // Handle final error
    self.domRenderer.clearSuccessState();
    self.domRenderer.setErrorState();
    self.errorHandler.dispatchErrorEvent(error);

    // Call Dropzone default + user callback
    Dropzone.prototype.defaultOptions.error!.apply(this, [
      file,
      message,
      xhr,
    ]);
    if (self.shubox.options.error) {
      self.shubox.options.error(file, message);
    }
  }
```

**Step 2: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 3: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: migrate error callback to use ShuboxErrorHandler"
```

---

## Task 11: Migrate success() Callback to Use New Modules

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Update success callback**

Replace the `success` method with:

```typescript
  success(file: ShuboxDropzoneFile, response: string): void {
    const self = this;

    // Check for recovery from previous failures
    const hadPreviousFailures =
      file._shuboxRetryCount && file._shuboxRetryCount > 0;
    if (hadPreviousFailures) {
      self.errorHandler.dispatchRecoveredEvent();
    }

    // Update DOM
    self.domRenderer.setSuccessState();

    // Parse S3 URL from XML response
    const match = /\<Location\>(.*)\<\/Location\>/g.exec(response) || ['', ''];
    file.s3url = match[1].replace(/%2F/g, '/').replace(/%2B/g, '%20');

    // Apply CDN URL if configured
    if (self.shubox.options.cdn) {
      const path = file.s3url.split('/').slice(4).join('/');
      file.s3url = `${self.shubox.options.cdn}/${path}`;
    }

    // Send upload complete notification
    uploadCompleteEvent(self.shubox, file as IShuboxFile, self.shubox.options.extraParams || {})
      .then(() => {
        // Handle transforms
        if (self.transformManager.hasTransforms(self.shubox.options.transforms)) {
          const variants = self.transformManager.getTransformVariants(
            self.shubox.options.transforms!
          );
          for (const variant of variants) {
            new TransformCallback(
              self.shubox,
              file as IShuboxFile,
              variant
            ).run();
          }
        }

        // Update form value if applicable
        if (self._isFormElement()) {
          self._updateFormValue(file, 'successTemplate');
        }

        // Call user success callback
        if (self.shubox.options.success) {
          self.shubox.options.success(file);
        }
      })
      .catch((err) => {
        console.error('Error in upload complete event:', err);
      });

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.success!.apply(this, [file, response]);
  }
```

**Step 2: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 3: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: migrate success callback to use new modules"
```

---

## Task 12: Migrate Remaining Callbacks to Use New Modules

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Update uploadProgress callback**

Replace the `uploadProgress` method with:

```typescript
  uploadProgress(file: ShuboxDropzoneFile, progress: number): void {
    const self = this;
    self.domRenderer.setProgress(progress);

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.uploadprogress!.apply(this, [
      file,
      progress,
    ]);
  }
```

**Step 2: Update canceled callback**

Replace the `canceled` method with:

```typescript
  canceled(file: ShuboxDropzoneFile): void {
    const self = this;
    self.resourceManager.onFileCanceled(file);

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.canceled!.apply(this, [file]);
  }
```

**Step 3: Update removedfile callback**

Replace the `removedfile` method with:

```typescript
  removedfile(file: ShuboxDropzoneFile): void {
    const self = this;
    self.resourceManager.onFileRemoved(file);

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.removedfile!.apply(this, [file]);
  }
```

**Step 4: Update addedfile callback**

Replace the `addedfile` method with:

```typescript
  addedfile(file: ShuboxDropzoneFile): void {
    const self = this;

    if (!self.shubox.options.acceptedFiles) {
      self.shubox.options.acceptedFiles = ShuboxConfig.DEFAULT_ACCEPTED_FILES;
    }

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);
  }
```

**Step 5: Update queuecomplete callback**

Replace the `queuecomplete` method with:

```typescript
  queuecomplete(): void {
    const self = this;
    self.resourceManager.onQueueComplete();
    self.domRenderer.clearProgress();

    // Call Dropzone default
    Dropzone.prototype.defaultOptions.queuecomplete!.apply(this, []);
  }
```

**Step 6: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 7: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: migrate remaining callbacks to use new modules"
```

---

## Task 13: Clean Up ShuboxCallbacks Private Methods - Part 1

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Remove \_cleanupFile method**

Remove the `_cleanupFile` method - it's now handled by `ShuboxResourceManager.cleanupFile()`

**Step 2: Remove updateFormValue related methods**

Replace `_updateFormValue`, `_isFormElement`, `_isAppendingText`, `_insertableAtCursor`, and `_placeCursorAfterText` with a single delegating method:

```typescript
  private _updateFormValue(file: ShuboxDropzoneFile, templateName: string): void {
    const self = this;

    if (!self._isFormElement()) {
      return;
    }

    const template =
      templateName === 'successTemplate'
        ? self.shubox.options.successTemplate || ShuboxConfig.DEFAULT_SUCCESS_TEMPLATE
        : self.shubox.options.uploadingTemplate || ShuboxConfig.DEFAULT_UPLOADING_TEMPLATE;

    const textBehavior = self.shubox.options.textBehavior || ShuboxConfig.DEFAULT_TEXT_BEHAVIOR;

    const interpolations: Record<string, string> = {};
    for (const key of self.replaceable) {
      interpolations[key] = (file as any)[key] || '';
    }

    const input = self.shubox.element as HTMLInputElement | HTMLTextAreaElement;
    self.domRenderer.updateFormValue(input, template, self.replaceable, textBehavior, interpolations);

    // Place cursor after inserted text if appending
    if (textBehavior === 'append' && self._insertableAtCursor(input)) {
      self.domRenderer.placeCursorAfterText(input, template);
    }
  }

  private _isFormElement(): boolean {
    return (
      this.shubox.element instanceof HTMLInputElement ||
      this.shubox.element instanceof HTMLTextAreaElement
    );
  }

  private _insertableAtCursor(el: HTMLElement): boolean {
    return (
      (el instanceof HTMLInputElement && (el.type === 'text' || el.type === '')) ||
      el instanceof HTMLTextAreaElement
    );
  }
```

**Step 3: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 4: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: remove cleanup methods from ShuboxCallbacks, delegate to modules"
```

---

## Task 14: Update ShuboxDomRenderer with Cursor Placement

**Files:**

- Modify: `src/shubox/dom_renderer.ts`
- Modify: `tests/shubox/dom_renderer.test.ts`

**Step 1: Add cursor placement test**

Add to `tests/shubox/dom_renderer.test.ts`:

```typescript
describe('cursor placement', () => {
  test('placeCursorAfterText positions cursor after inserted text', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'Hello world new text';
    element.appendChild(textarea);

    renderer.placeCursorAfterText(textarea, 'new text');

    // Cursor should be after "new text"
    expect(textarea.selectionStart).toBe('Hello world new text'.length);
    expect(textarea.selectionEnd).toBe('Hello world new text'.length);
  });

  test('placeCursorAfterText works with INPUT elements', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'test value';
    element.appendChild(input);

    renderer.placeCursorAfterText(input, 'value');

    expect(input.selectionStart).toBe(input.value.length);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: Test fails with "placeCursorAfterText is not a function"

**Step 3: Add implementation to ShuboxDomRenderer**

Add this method to `src/shubox/dom_renderer.ts`:

```typescript
  placeCursorAfterText(element: HTMLElement, text: string): void {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      return;
    }

    const value = element.value;
    const position = value.lastIndexOf(text);

    if (position !== -1) {
      const cursorPosition = position + text.length;
      element.setSelectionRange(cursorPosition, cursorPosition);
      element.focus();
    }
  }
```

**Step 4: Run test to verify it passes**

```bash
npm test -- tests/shubox/dom_renderer.test.ts
```

Expected output: All tests pass

**Step 5: Commit**

```bash
git add src/shubox/dom_renderer.ts tests/shubox/dom_renderer.test.ts
git commit -m "feat: add cursor placement functionality to ShuboxDomRenderer"
```

---

## Task 15: Remove \_isRecoverableUploadError from ShuboxCallbacks

**Files:**

- Modify: `src/shubox/shubox_callbacks.ts`

**Step 1: Remove the \_isRecoverableUploadError method**

This method is now in `ShuboxErrorHandler.isRecoverableError()`

**Step 2: Verify all error handling uses ShuboxErrorHandler**

Ensure the `error` callback uses `self.errorHandler.isRecoverableError()` (already done in Task 10)

**Step 3: Run tests**

```bash
npm test
```

Expected output: All tests pass

**Step 4: Commit**

```bash
git add src/shubox/shubox_callbacks.ts
git commit -m "refactor: remove _isRecoverableUploadError, use ShuboxErrorHandler"
```

---

## Task 16: End-to-End Integration Test

**Files:**

- Modify: `tests/shubox/shubox_callbacks.test.ts` (create if doesn't exist)

**Step 1: Create integration test**

Create `tests/shubox/shubox_callbacks.test.ts`:

```typescript
/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { Shubox } from '../src/shubox/index';
import { ShuboxCallbacks } from '../src/shubox/shubox_callbacks';
import { setupJsDom } from './test_helpers';
import type Dropzone from 'dropzone';

describe('ShuboxCallbacks Integration', () => {
  let element: HTMLElement;
  let shubox: Shubox;
  let callbacks: ShuboxCallbacks;
  let mockDropzone: any;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);

    shubox = new Shubox({
      key: 'test-key',
      element,
    });

    mockDropzone = {
      files: [],
      options: {},
      processFile: vi.fn(),
      disable: vi.fn(),
      enable: vi.fn(),
    };

    callbacks = new ShuboxCallbacks(shubox, [mockDropzone as any]);
  });

  test('callbacks coordinate between modules successfully', async () => {
    const callbacksHash = callbacks.toHash();

    expect(callbacksHash).toHaveProperty('accept');
    expect(callbacksHash).toHaveProperty('success');
    expect(callbacksHash).toHaveProperty('error');
    expect(callbacksHash).toHaveProperty('uploadProgress');
    expect(callbacksHash).toHaveProperty('canceled');
    expect(callbacksHash).toHaveProperty('removedfile');
    expect(callbacksHash).toHaveProperty('queuecomplete');
  });

  test('all modules are initialized', () => {
    expect((callbacks as any).domRenderer).toBeDefined();
    expect((callbacks as any).apiClient).toBeDefined();
    expect((callbacks as any).errorHandler).toBeDefined();
    expect((callbacks as any).resourceManager).toBeDefined();
    expect((callbacks as any).transformManager).toBeDefined();
  });
});
```

**Step 2: Run tests**

```bash
npm test -- tests/shubox/shubox_callbacks.test.ts
```

Expected output: All tests pass

**Step 3: Commit**

```bash
git add tests/shubox/shubox_callbacks.test.ts
git commit -m "test: add integration tests for refactored ShuboxCallbacks"
```

---

## Task 17: Demo Upload Test with Playwright

**Files:**

- No new files, but requires running dev server and Playwright test

**Step 1: Create Playwright test**

Create `/tmp/test-upload.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('upload image to Shubox demo', async ({ page, context }) => {
  // Start the page
  await page.goto('http://localhost:8888/demo/index.html');

  // Wait for dropzone to be loaded
  await page.waitForSelector('.dropzone');

  // Create a test file (sample image)
  const filePath = '/Users/joel/Development/shubox.js/tmp/huh.jpg';

  // Set input file
  await page.setInputFiles('input[type="file"]', filePath);

  // Wait for upload to complete (look for success state)
  await page.waitForSelector('.shubox-success', { timeout: 30000 });

  // Verify success
  const hasSuccessClass = await page.locator('.shubox-success').isVisible();
  expect(hasSuccessClass).toBe(true);

  // Verify no error class present
  const hasErrorClass = await page.locator('.shubox-error').isVisible();
  expect(hasErrorClass).toBe(false);
});
```

**Step 2: Run dev server in background**

```bash
npm run dev &
```

Wait for it to start on http://localhost:8888

**Step 3: Run Playwright test**

```bash
npx playwright test /tmp/test-upload.ts
```

Expected output: Test passes with successful upload

**Step 4: Verify test output**

- Confirm file uploaded successfully
- Confirm success CSS class applied
- Confirm no error states

**Step 5: Stop dev server**

```bash
pkill -f "node.*8888"
```

**Step 6: Commit**

```bash
git add /tmp/test-upload.ts
git commit -m "test: add Playwright e2e test for upload functionality"
```

---

## Task 18: Final Test Run and Cleanup

**Files:**

- Review all changes

**Step 1: Run all tests**

```bash
npm test
```

Expected output: All tests pass (100+ tests)

**Step 2: Build the project**

```bash
npm run build
```

Expected output: Build succeeds with no errors

**Step 3: Verify type checking**

```bash
npx tsc --noEmit
```

Expected output: No type errors

**Step 4: Run dev server for manual testing**

```bash
npm run dev
```

Visit http://localhost:8888/demo/index.html and manually test upload to confirm everything works

**Step 5: Create final commit**

```bash
git add -A
git commit -m "refactor: complete modularization of ShuboxCallbacks

- Extracted ShuboxConfig for configuration constants
- Extracted ShuboxDomRenderer for DOM manipulation
- Extracted ShuboxApiClient for API communication
- Extracted ShuboxErrorHandler for error handling and retries
- Extracted ShuboxResourceManager for file lifecycle
- Extracted ShuboxTransformManager for image transforms
- All tests passing (100+ test cases)
- Full backwards compatibility maintained
- Ready for improved tree-shaking and maintainability"
```

---

## Execution Checklist

After completing all 18 tasks:

- [ ] All unit tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Dev server runs successfully (`npm run dev`)
- [ ] Manual upload test works at http://localhost:8888/demo/index.html
- [ ] Playwright e2e test passes
- [ ] All commits follow conventional commit format
- [ ] Code review passed (using superpowers:requesting-code-review)
- [ ] Ready for merge to master
