// @flow
/* eslint-disable max-nested-callbacks */
import assert from 'assert';
import {describe, it} from 'mocha';

import {transform} from '../src/index';

describe('transform', function() {
  it('id', function() {
    const schema = {$id: 'FooId'};
    assert.strictEqual(transform(schema), 'export type FooId = any;');
  });
  describe('types', function() {
    describe('primitive types', function() {
      it('null', function() {
        const schema = {$id: 'Id', type: 'null'};
        assert.strictEqual(transform(schema), 'export type Id = null;');
      });
      it('boolean', function() {
        const schema = {$id: 'Id', type: 'boolean'};
        assert.strictEqual(transform(schema), 'export type Id = boolean;');
      });
      it('number', function() {
        const schema = {$id: 'Id', type: 'number'};
        assert.strictEqual(transform(schema), 'export type Id = number;');
      });
      it('string', function() {
        const schema = {$id: 'Id', type: 'string'};
        assert.strictEqual(transform(schema), 'export type Id = string;');
      });
    });
  });
});
