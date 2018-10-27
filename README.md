# Igata

![npm version](https://img.shields.io/npm/v/igata.svg?style=flat)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![CircleCI](https://circleci.com/gh/sakai-akinobu/igata.svg?style=svg)](https://circleci.com/gh/sakai-akinobu/igata)

Convert a JSON Schema to a Flow type definition.

## Installation

```
npm install --save igata
```

## Usage

```javascript
import {convert} from 'igata';

convert({$id: 'String', type: 'string'});
// => export type String = string;

convert({$id: 'Enum', enum: [1, 2]});
// => export type Enum = 1 | 2;

convert({$id: 'Object', type: 'object', properties: {foo: {type: 'string'}}});
// => export type Object = {\n  foo?: string\n};

convert({$id: 'Array', type: 'array', items: {type: 'string'}});
// => export type Array = string[];

convert({$id: 'Tuple', type: 'array', items: [{type: 'string'}, {type: 'number'}]});
// => export type Tuple = [string, number];

convert({$id: 'Union', type: ['string', 'number']});
// => export type Union = string | number;

convert({$id: 'ComplexUnion', anyOf: [{type: 'number'}, {type: 'object', properties: {foo: {type: 'string'}}}]});
// => export type ComplexUnion = number | {\n  foo?: string\n};
```

Following example is a nullable type.

```javascript
const jsonSchema = {
  $id: 'Nullable',
  type: ['string', 'null'],
};
convert(jsonSchema);
// => export type Nullable = string | null;
```

Following example is an [exact object type](https://flow.org/en/docs/types/objects/#toc-exact-object-types).

```javascript
const jsonSchema = {
  $id: 'ExactObject',
  type: 'object',
  additionalProperties: false,
  properties: {
    foo: {
      type: 'string',
    },
  },
};
convert(jsonSchema);
// => export type ExactObject = {|\n  foo?: string\n|};
```

Following example is a reference to a definition using `$ref`.

```javascript
const jsonSchema = {
  $id: 'Definition',
  $ref: '#/definitions/foo',
  definitions: {
    foo: {
      type: 'object',
      properties: {
        bar: {
          type: 'string',
        },
      },
    },
  },
};
convert(jsonSchema);
// => export type Definition = {\n  bar?: string\n};
```

## Test

```
npm run test
```

## Demo

https://igata.netlify.com/

## License

MIT license.
