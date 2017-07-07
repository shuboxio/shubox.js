import * as Chai from 'chai';
import { mergeObject } from '../../src/lib/merge_object';

const expect = Chai.expect;

describe('mergeObject', () => {
  it('returns a merged object literal', () => {
    let result = mergeObject(
      {},
      { first_name: 'Joel' },
      { last_name: 'Oliveira' },
    )

    expect(result).to.deep.equal({
      first_name: 'Joel',
      last_name: 'Oliveira',
    })
  })
})
