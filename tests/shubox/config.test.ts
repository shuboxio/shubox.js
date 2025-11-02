/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { ShuboxConfig } from '../../src/shubox/config';

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
