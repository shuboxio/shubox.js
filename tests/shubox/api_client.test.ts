/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxApiClient } from '../../src/shubox/api/ApiClient';
import Shubox from '../../src/shubox/core/Shubox';
import { setupJsDom } from '../test_helpers';

describe('ShuboxApiClient', () => {
  let element: HTMLElement;
  let shubox: Shubox;
  let client: ShuboxApiClient;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    element.id = 'test-form';
    document.body.appendChild(element);

    shubox = new Shubox('#test-form', {
      key: 'test-key',
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
        } as Response)
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
        } as Response)
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
