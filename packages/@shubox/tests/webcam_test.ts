import * as Chai from "chai";
import chaiDom from "chai-dom";
import Shubox from "shubox";
import {setupJsDom, teardownJsDom} from "./test_helper";

Chai.use(chaiDom);
const expect = Chai.expect;

describe("Shubox", () => {
  describe("webcam setup", () => {
    beforeEach((done) => {
      setupJsDom(() => {
        const main = document.querySelector("#main") || document.createElement("div");
        const webcamEl = document.createElement("div");
        webcamEl.id = "webcam";
        main.appendChild(webcamEl);

        done();
      });
    });

    afterEach(() => {
      teardownJsDom();
    });

    it("initializes an element that can start video capture", () => {
      const shubox = new Shubox("#webcam", { webcam: "photo" });
      const shuboxEl = document.querySelector("#webcam");

      expect(shuboxEl).to.have.class("shubox-webcam-uninitialized");
    });
  });
});
