// @flow
import assert from 'assert';
import {describe, it} from 'mocha';

import {transform} from '../src/index';

describe('transform', function() {
  it('id', function() {
    const schema = {$id: 'FooId'};
    assert.strictEqual(transform(schema), 'export type FooId = any;');
  });
});
