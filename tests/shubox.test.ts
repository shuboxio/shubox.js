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

  describe('for webcam usage', () => {
    test("initializes an element that can start video capture", () => {
      const main = document.querySelector("#main") || document.createElement("div");
      const webcamEl = document.createElement("div");
      webcamEl.id = "webcam";
      main.appendChild(webcamEl);

      new Shubox("#webcam", { webcam: "photo" });
      const shuboxEl = document.querySelector("#webcam");

      expect(shuboxEl?.classList).toContain("shubox-webcam-uninitialized");
    });
  })
})
