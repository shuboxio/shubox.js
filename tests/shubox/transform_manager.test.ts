/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxTransformManager } from '../../src/shubox/transform_manager';
import { setupJsDom } from '../test_helpers';

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
