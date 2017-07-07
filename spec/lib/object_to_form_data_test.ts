import * as Chai from 'chai';
import { objectToFormData } from '../../src/lib/object_to_form_data';
import { setupJsDom, teardownJsDom } from '../spec_helper';
const expect = Chai.expect;

describe('objectToFormData', () => {
  beforeEach((done) => {
    setupJsDom(() => done());
  });

  afterEach(() => {
    teardownJsDom();
  });

  it('returns a FormData object made from a hash object', () => {
    let expectedFormData = new (<any>window).FormData();
    expectedFormData.append("name", "joel");
    expectedFormData.append("city", "boston");

    let result = objectToFormData({
      name: 'joel',
      city: 'boston',
    })

    expect(result).to.deep.equal(expectedFormData);
  })

  it('works with a nested hash', () => {
    let expectedFormData = new (<any>window).FormData();
    expectedFormData.append("name[first]", "joel");
    expectedFormData.append("name[last]", "oliveira");
    expectedFormData.append("city", "boston");

    let result = objectToFormData({
      name: {
        first: 'joel',
        last: 'oliveira',
      },
      city: 'boston',
    })

    expect(result).to.deep.equal(expectedFormData);
  })
})
