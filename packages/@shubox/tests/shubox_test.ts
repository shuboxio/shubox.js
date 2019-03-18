import * as Chai from "chai";
import Shubox from "shubox";
import {setupJsDom, teardownJsDom} from "./test_helper";

const expect = Chai.expect;

describe("Shubox", () => {
  describe(".instances", () => {
    beforeEach((done) => {
      setupJsDom(() => {
        done();
      });
    });

    afterEach(() => {
      teardownJsDom();
    });

    it("holds onto all instances of shubox on a page", () => {
      const _noop = new Shubox(".upload");
      expect(Shubox.instances.length).to.equal(2);
    });
  });
});
