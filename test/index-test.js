// @flow
/* eslint-disable max-nested-callbacks */
import assert from 'assert';
import {describe, it} from 'mocha';

import {convert} from '../src/index';

describe('convert', function() {
  describe('invalid argument', function() {
    const errorMessage = /Argument must be an object\./;
    it('boolean', function() {
      // flow-disable-next-line
      assert.throws(() => convert(true), errorMessage);
    });
    it('number', function() {
      // flow-disable-next-line
      assert.throws(() => convert(1), errorMessage);
    });
    it('string', function() {
      // flow-disable-next-line
      assert.throws(() => convert('a'), errorMessage);
    });
    it('array', function() {
      // flow-disable-next-line
      assert.throws(() => convert([]), errorMessage);
    });
    it('null', function() {
      // flow-disable-next-line
      assert.throws(() => convert(null), errorMessage);
    });
    it('undefined', function() {
      // flow-disable-next-line
      assert.throws(() => convert(), errorMessage);
    });
  });
  describe('id', function() {
    it('when given', function() {
      const schema = {$id: 'FooId'};
      assert.strictEqual(convert(schema), 'export type FooId = any;');
    });
    it('when not given', function() {
      const schema = {$id: ''};
      assert.throws(() => convert(schema), /Root JSON Schema required \$id property\./);
    });
  });
  describe('types', function() {
    describe('primitive types', function() {
      it('null', function() {
        const schema = {$id: 'Id', type: 'null'};
        assert.strictEqual(convert(schema), 'export type Id = null;');
      });
      it('boolean', function() {
        const schema = {$id: 'Id', type: 'boolean'};
        assert.strictEqual(convert(schema), 'export type Id = boolean;');
      });
      it('number', function() {
        const schema = {$id: 'Id', type: 'number'};
        assert.strictEqual(convert(schema), 'export type Id = number;');
      });
      it('string', function() {
        const schema = {$id: 'Id', type: 'string'};
        assert.strictEqual(convert(schema), 'export type Id = string;');
      });
    });
    describe('array', function() {
      it('[]', function() {
        const schema = {$id: 'Id', type: 'array', items: []};
        assert.strictEqual(convert(schema), 'export type Id = [];');
      });
      it('[string]', function() {
        const schema = {$id: 'Id', type: 'array', items: [{type: 'string'}]};
        assert.strictEqual(convert(schema), 'export type Id = [string];');
      });
      it('[string, number]', function() {
        const schema = {$id: 'Id', type: 'array', items: [{type: 'string'}, {type: 'number'}]};
        assert.strictEqual(convert(schema), 'export type Id = [string, number];');
      });
      it('string[]', function() {
        const schema = {$id: 'Id', type: 'array', items: {type: 'string'}};
        assert.strictEqual(convert(schema), 'export type Id = string[];');
      });
    });
    describe('object', function() {
      it('{}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {}};
        assert.strictEqual(convert(schema), 'export type Id = {};');
      });
      it('{foo?: string}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n};');
      });
      it('{foo?: string, bar?: number}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string,\n  bar?: number,\n};');
      });
      it('{foo: string, bar: number}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }, required: ['foo']};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo: string,\n  bar?: number,\n};');
      });
      it('{|foo?: string|}', function() {
        const schema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }, additionalProperties: false};
        assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|};');
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
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: {\n    bar?: string\n  }\n};');
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
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: [string, number]\n};');
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
        assert.strictEqual(convert(schema), 'export type Id = [{\n  foo?: string\n}];');
      });
    });
  });
  describe('enum', function() {
    it('1 | 2', function() {
      const schema = {$id: 'Id', enum: [1, 2]};
      assert.strictEqual(convert(schema), 'export type Id = 1 | 2;');
    });
    it('"a" | 1', function() {
      const schema = {$id: 'Id', enum: ['a', 1]};
      assert.strictEqual(convert(schema), 'export type Id = "a" | 1;');
    });
    it('{"a":1} | ["b",2]', function() {
      const schema = {$id: 'Id', enum: [{a: 1}, ['b', 2]]};
      assert.strictEqual(convert(schema), 'export type Id = {"a":1} | ["b",2];');
    });
    it('1', function() {
      const schema = {$id: 'Id', enum: [1]};
      assert.strictEqual(convert(schema), 'export type Id = 1;');
    });
  });
  describe('anyOf', function() {
    it('string | null', function() {
      const schema = {$id: 'Id', anyOf: [
        {type: 'string'},
        {type: 'null'},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = string | null;');
    });
    it('{foo?: string} | {bar?: number}', function() {
      const schema = {$id: 'Id', anyOf: [
        {type: 'object', properties: {foo: {type: 'string'}}},
        {type: 'object', properties: {bar: {type: 'number'}}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n} | {\n  bar?: number\n};');
    });
    it('{|foo?: string|} | number[]', function() {
      const schema = {$id: 'Id', anyOf: [
        {type: 'object', properties: {foo: {type: 'string'}}, additionalProperties: false},
        {type: 'array', items: {type: 'number'}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|} | number[];');
    });
  });
  describe('oneOf', function() {
    it('string | null', function() {
      const schema = {$id: 'Id', oneOf: [
        {type: 'string'},
        {type: 'null'},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = string | null;');
    });
    it('{foo?: string} | {bar?: number}', function() {
      const schema = {$id: 'Id', oneOf: [
        {type: 'object', properties: {foo: {type: 'string'}}},
        {type: 'object', properties: {bar: {type: 'number'}}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n} | {\n  bar?: number\n};');
    });
    it('{|foo?: string|} | number[]', function() {
      const schema = {$id: 'Id', oneOf: [
        {type: 'object', properties: {foo: {type: 'string'}}, additionalProperties: false},
        {type: 'array', items: {type: 'number'}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|} | number[];');
    });
  });
});
