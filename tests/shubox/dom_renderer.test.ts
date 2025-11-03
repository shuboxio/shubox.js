/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach } from 'vitest';
import { ShuboxDomRenderer } from '../../src/shubox/dom/DomRenderer';
import { setupJsDom } from '../test_helpers';

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
      renderer.updateFormValue(
        input,
        template,
        ['s3url', 'size'],
        'replace',
        { s3url: 'https://example.com/image.jpg', size: '1024' }
      );

      expect(input.value).toBe('https://example.com/image.jpg - 1024 bytes');
    });
  });

  describe('cursor placement', () => {
    test('placeCursorAfterText positions cursor correctly in INPUT element', () => {
      const input = document.createElement('input');
      input.value = 'before text after';
      element.appendChild(input);

      renderer.placeCursorAfterText(input, 'text');

      expect(input.selectionStart).toBe(11); // Position after 'text'
      expect(input.selectionEnd).toBe(11);
    });

    test('placeCursorAfterText positions cursor correctly in TEXTAREA element', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'some text here';
      element.appendChild(textarea);

      renderer.placeCursorAfterText(textarea, 'text');

      expect(textarea.selectionStart).toBe(9); // Position after 'text'
      expect(textarea.selectionEnd).toBe(9);
    });

    test('placeCursorAfterText handles text at beginning of value', () => {
      const input = document.createElement('input');
      input.value = 'start of text';
      element.appendChild(input);

      renderer.placeCursorAfterText(input, 'start');

      expect(input.selectionStart).toBe(5); // Position after 'start'
      expect(input.selectionEnd).toBe(5);
    });
  });
});
