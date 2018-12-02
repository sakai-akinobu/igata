/* eslint-disable max-nested-callbacks */
import * as assert from 'power-assert';
import {describe, it} from 'mocha';

import {convert} from '../src/index';
import {JSONSchema} from '../src/types';

describe('convert', function() {
  describe('invalid argument', function() {
    const errorMessage = /Argument must be an object\./;
    it('boolean', function() {
      assert.throws(() => convert(true as any), errorMessage);
    });
    it('number', function() {
      assert.throws(() => convert(1 as any), errorMessage);
    });
    it('string', function() {
      assert.throws(() => convert('a' as any), errorMessage);
    });
    it('array', function() {
      assert.throws(() => convert([] as any), errorMessage);
    });
    it('null', function() {
      assert.throws(() => convert(null), errorMessage);
    });
    it('undefined', function() {
      assert.throws(() => convert(undefined), errorMessage);
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
        const schema: JSONSchema = {$id: 'Id', type: 'null'};
        assert.strictEqual(convert(schema), 'export type Id = null;');
      });
      it('boolean', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'boolean'};
        assert.strictEqual(convert(schema), 'export type Id = boolean;');
      });
      it('number', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'number'};
        assert.strictEqual(convert(schema), 'export type Id = number;');
      });
      it('integer', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'integer'};
        assert.strictEqual(convert(schema), 'export type Id = number;');
      });
      it('string', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'string'};
        assert.strictEqual(convert(schema), 'export type Id = string;');
      });
    });
    describe('multiple types', function() {
      it('number | null', function() {
        const schema: JSONSchema = {$id: 'Id', type: ['number', 'null']};
        assert.strictEqual(convert(schema), 'export type Id = number | null;');
      });
      it('number | {foo?: string}', function() {
        const schema: JSONSchema = {$id: 'Id', type: ['number', 'object'], properties: {foo: {type: 'string'}}};
        assert.strictEqual(convert(schema), 'export type Id = number | {\n  foo?: string\n};');
      });
      it('{foo?: string} | string[]', function() {
        const schema: JSONSchema = {$id: 'Id', type: ['object', 'array'], properties: {foo: {type: 'string'}}, items: {type: 'string'}};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n} | string[];');
      });
    });
    describe('array', function() {
      it('[]', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'array', items: []};
        assert.strictEqual(convert(schema), 'export type Id = [];');
      });
      it('[string]', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'array', items: [{type: 'string'}]};
        assert.strictEqual(convert(schema), 'export type Id = [string];');
      });
      it('[string, number]', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'array', items: [{type: 'string'}, {type: 'number'}]};
        assert.strictEqual(convert(schema), 'export type Id = [string, number];');
      });
      it('string[]', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'array', items: {type: 'string'}};
        assert.strictEqual(convert(schema), 'export type Id = string[];');
      });
    });
    describe('object', function() {
      it('{}', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {}};
        assert.strictEqual(convert(schema), 'export type Id = {};');
      });
      it('{foo?: string}', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n};');
      });
      it('{foo?: string, bar?: number}', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string,\n  bar?: number,\n};');
      });
      it('{foo: string, bar: number}', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
          bar: {type: 'number'},
        }, required: ['foo']};
        assert.strictEqual(convert(schema), 'export type Id = {\n  foo: string,\n  bar?: number,\n};');
      });
      it('{|foo?: string|}', function() {
        const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
          foo: {type: 'string'},
        }, additionalProperties: false};
        assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|};');
      });
    });
  });
  describe('enum', function() {
    it('1 | 2', function() {
      const schema: JSONSchema = {$id: 'Id', enum: [1, 2]};
      assert.strictEqual(convert(schema), 'export type Id = 1 | 2;');
    });
    it('"a" | 1', function() {
      const schema: JSONSchema = {$id: 'Id', enum: ['a', 1]};
      assert.strictEqual(convert(schema), 'export type Id = "a" | 1;');
    });
    it('{"a":1} | ["b",2]', function() {
      const schema: JSONSchema = {$id: 'Id', enum: [{a: 1}, ['b', 2]]};
      assert.strictEqual(convert(schema), 'export type Id = {"a":1} | ["b",2];');
    });
    it('1', function() {
      const schema: JSONSchema = {$id: 'Id', enum: [1]};
      assert.strictEqual(convert(schema), 'export type Id = 1;');
    });
  });
  describe('anyOf', function() {
    it('string | null', function() {
      const schema: JSONSchema = {$id: 'Id', anyOf: [
        {type: 'string'},
        {type: 'null'},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = string | null;');
    });
    it('{foo?: string} | {bar?: number}', function() {
      const schema: JSONSchema = {$id: 'Id', anyOf: [
        {type: 'object', properties: {foo: {type: 'string'}}},
        {type: 'object', properties: {bar: {type: 'number'}}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n} | {\n  bar?: number\n};');
    });
    it('{|foo?: string|} | number[]', function() {
      const schema: JSONSchema = {$id: 'Id', anyOf: [
        {type: 'object', properties: {foo: {type: 'string'}}, additionalProperties: false},
        {type: 'array', items: {type: 'number'}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|} | number[];');
    });
  });
  describe('oneOf', function() {
    it('string | null', function() {
      const schema: JSONSchema = {$id: 'Id', oneOf: [
        {type: 'string'},
        {type: 'null'},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = string | null;');
    });
    it('{foo?: string} | {bar?: number}', function() {
      const schema: JSONSchema = {$id: 'Id', oneOf: [
        {type: 'object', properties: {foo: {type: 'string'}}},
        {type: 'object', properties: {bar: {type: 'number'}}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {\n  foo?: string\n} | {\n  bar?: number\n};');
    });
    it('{|foo?: string|} | number[]', function() {
      const schema: JSONSchema = {$id: 'Id', oneOf: [
        {type: 'object', properties: {foo: {type: 'string'}}, additionalProperties: false},
        {type: 'array', items: {type: 'number'}},
      ]};
      assert.strictEqual(convert(schema), 'export type Id = {|\n  foo?: string\n|} | number[];');
    });
  });
  describe('complex types', function() {
    it('nested object', function() {
      const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
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
      const schema: JSONSchema = {$id: 'Id', type: 'object', properties: {
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
      const schema: JSONSchema = {$id: 'Id', type: 'array', items: [
        {
          type: 'object',
          properties: {
            foo: {type: 'string'},
          },
        },
      ]};
      assert.strictEqual(convert(schema), 'export type Id = [{\n  foo?: string\n}];');
    });
    it('too complex...', function() {
      const schema: JSONSchema = {
        $id: 'Id',
        type: 'object',
        properties: {
          prop1: {
            type: 'number',
          },
          prop2: {
            enum: ['a', 'b', 1, null],
          },
          prop3: {
            anyOf: [
              {
                type: 'object',
                properties: {
                  list: {
                    type: 'array',
                    items: [
                      {
                        type: 'object',
                        properties: {
                          foo: {
                            type: 'string',
                          },
                        },
                      },
                      {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    ],
                  },
                  object: {
                    type: 'object',
                    properties: {
                      a: {type: 'boolean'},
                    },
                  },
                },
                required: [
                  'list',
                ],
                additionalProperties: false,
              },
            ],
          },
        },
      };
      assert.strictEqual(convert(schema),
        [
          'export type Id = {',
          '  prop1?: number,',
          '  prop2?: "a" | "b" | 1 | null,',
          '  prop3?: {|',
          '    list: [{',
          '      foo?: string',
          '    }, string[]],',
          '    object?: {',
          '      a?: boolean',
          '    },',
          '  |},',
          '};',
        ].join('\n'),
      );
    });
  });
  describe('definitions', function() {
    it('reference from root schema', function() {
      const schema: JSONSchema = {
        $id: 'Id',
        $ref: 'def1',
        definitions: {
          def1: {
            type: 'string',
          },
        },
      };
      assert.strictEqual(convert(schema), 'export type Id = string;');
    });
    it('reference from nested object', function() {
      const schema: JSONSchema = {
        $id: 'Id',
        type: 'object',
        properties: {
          foo: {
            $ref: '#/definitions/def1',
          },
          bar: {
            type: 'object',
            properties: {
              piyo: {
                $ref: '#/definitions/def2',
              },
            },
          },
        },
        definitions: {
          def1: {
            type: 'string',
          },
          def2: {
            type: 'object',
            properties: {
              prop1: {
                type: 'number',
              },
              prop2: {
                type: 'array',
                items: {type: 'string'},
              },
            },
          },
        },
      };
      assert.strictEqual(convert(schema),
        [
          'export type Id = {',
          '  foo?: string,',
          '  bar?: {',
          '    piyo?: {',
          '      prop1?: number,',
          '      prop2?: string[],',
          '    }',
          '  },',
          '};',
        ].join('\n'),
      );
    });
    it('nested definition', function() {
      const schema: JSONSchema = {
        $id: 'Id',
        $ref: '#/definitions/parent',
        definitions: {
          parent: {
            $ref: '#/definitions/child',
          },
          child: {
            type: 'string',
          },
        },
      };
      assert.strictEqual(convert(schema), 'export type Id = string;');
    });
    it('invalid definition name', function() {
      const schema: JSONSchema = {
        $id: 'Id',
        $ref: '#/definitions/doNotExist',
        definitions: {
          def1: {
            type: 'string',
          },
        },
      };
      const errorMessage = /JSON Schema definition was not found. /;
      assert.throws(() => convert(schema), errorMessage);
    });
  });
});
