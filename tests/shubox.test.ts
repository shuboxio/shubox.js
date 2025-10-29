/**
 * @vitest-environment jsdom
 */
import Shubox from '../src/shubox';
import { beforeEach, describe, expect, test } from 'vitest'
import { setupJsDom } from './test_helpers';

beforeEach(async () => {
  await setupJsDom()
})

describe('shubox', () => {
  describe('.instances', () => {
    test('holds onto all instances of shubox on a page', () => {
      new Shubox(".upload");
      expect(Shubox.instances.length).to.equal(2);
    })
  })
})
