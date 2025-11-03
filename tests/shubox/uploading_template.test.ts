/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import Shubox from '../../src/shubox/core/Shubox'
import { ShuboxCallbacks } from '../../src/shubox/core/ShuboxCallbacks';

describe('Shubox uploadingTemplate functionality', () => {
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    textarea = document.createElement('textarea');
    textarea.id = 'test-textarea';
    document.body.appendChild(textarea);
  });

  afterEach(() => {
    document.body.removeChild(textarea);
  });

  test('inserts uploadingTemplate text during sending phase', () => {
    const shubox = new Shubox('#test-textarea', {
      key: 'test-key',
      uploadingTemplate: '![Uploading {{name}}...]()\n',
      successTemplate: '![{{name}}]({{s3url}})\n',
      textBehavior: 'append'
    });

    // Create a mock file
    const mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      s3: 'path/to/test.jpg',
      s3url: 'https://example.com/test.jpg',
      postData: {}
    } as any;

    // Trigger the sending callback (upload starts)
    const callbacks = shubox.callbacks;
    callbacks.sending.call(shubox, mockFile, new XMLHttpRequest(), new FormData());

    // Assert: uploadingTemplate should be in the textarea
    expect(textarea.value).toContain('![Uploading test.jpg...]()');
  });

  test('replaces uploadingTemplate with successTemplate on upload success', () => {
    const shubox = new Shubox('#test-textarea', {
      key: 'test-key',
      uploadingTemplate: '![Uploading {{name}}...]()\n',
      successTemplate: '![{{name}}]({{s3url}})\n',
      textBehavior: 'append'
    });

    const mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      s3: 'path/to/test.jpg',
      s3url: 'https://example.com/test.jpg',
      postData: {}
    } as any;

    // Manually set the uploading text first (simulating sending phase)
    textarea.value = '![Uploading test.jpg...]()\n';

    // Create a ShuboxCallbacks instance to test _updateFormValue directly
    const callbacksInstance = new ShuboxCallbacks(shubox, []);

    // Call _updateFormValue with successTemplate (simulating success phase)
    callbacksInstance._updateFormValue(mockFile, 'successTemplate');

    // Assert: uploadingTemplate should be replaced with successTemplate
    expect(textarea.value).not.toContain('Uploading');
    expect(textarea.value).toContain('![test.jpg](https://example.com/test.jpg)');
  });
});