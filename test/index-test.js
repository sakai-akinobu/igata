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
    describe('array', function() {
      it('[]', function() {
        const schema = {$id: 'Id', type: 'array', items: []};
        assert.strictEqual(transform(schema), 'export type Id = [];');
      });
      it('[string]', function() {
        const schema = {$id: 'Id', type: 'array', items: [{type: 'string'}]};
        assert.strictEqual(transform(schema), 'export type Id = [string];');
      });
      it('[string, number]', function() {
        const schema = {$id: 'Id', type: 'array', items: [{type: 'string'}, {type: 'number'}]};
        assert.strictEqual(transform(schema), 'export type Id = [string, number];');
      });
      it('string[]', function() {
        const schema = {$id: 'Id', type: 'array', items: {type: 'string'}};
        assert.strictEqual(transform(schema), 'export type Id = string[];');
      });
    });
    describe('object', function() {
      it('{}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {}};
        assert.strictEqual(transform(schema), 'export type Id = {};');
      });
      it('{foo?: string}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }};
        assert.strictEqual(transform(schema), 'export type Id = {\n  foo?: string\n};');
      });
      it('{foo?: string, bar?: number}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }};
        assert.strictEqual(transform(schema), 'export type Id = {\n  foo?: string,\n  bar?: number,\n};');
      });
      it('{foo: string, bar: number}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }, required: ['foo']};
        assert.strictEqual(transform(schema), 'export type Id = {\n  foo: string,\n  bar?: number,\n};');
      });
      it('{|foo?: string|}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }, additionalProperties: false};
        assert.strictEqual(transform(schema), 'export type Id = {|\n  foo?: string\n|};');
      });
    });
    describe('complex types', function() {
      it('nested object', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {type: 'string'},
            },
          },
        }};
        assert.strictEqual(transform(schema), 'export type Id = {\n  foo?: {\n    bar?: string\n  }\n};');
      });
      it('array in object', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {
            type: 'array',
            items: [
              {type: 'string'},
              {type: 'number'},
            ],
          },
        }};
        assert.strictEqual(transform(schema), 'export type Id = {\n  foo?: [string, number]\n};');
      });
      it('object in array', function() {
        const schema = {$id: 'Id', type: 'array', items: [
          {
            type: 'object',
            properties: {
              foo: {type: 'string'},
            },
          },
        ]};
        assert.strictEqual(transform(schema), 'export type Id = [{\n  foo?: string\n}];');
      });
    });
  });
  describe('enum', function() {
    it('1 | 2', function() {
      const schema = {$id: 'Id', enum: [1, 2]};
      assert.strictEqual(transform(schema), 'export type Id = 1 | 2;');
    });
    it('"a" | 1', function() {
      const schema = {$id: 'Id', enum: ['a', 1]};
      assert.strictEqual(transform(schema), 'export type Id = "a" | 1;');
    });
    it('{"a":1} | ["b",2]', function() {
      const schema = {$id: 'Id', enum: [{a: 1}, ['b', 2]]};
      assert.strictEqual(transform(schema), 'export type Id = {"a":1} | ["b",2];');
    });
    it('1', function() {
      const schema = {$id: 'Id', enum: [1]};
      assert.strictEqual(transform(schema), 'export type Id = 1;');
    });
  });
});
