/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach } from 'vitest';
import { ShuboxDomRenderer } from '../../src/shubox/dom_renderer';
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
});
