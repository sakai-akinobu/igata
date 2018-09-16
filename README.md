# Igata

![npm version](https://img.shields.io/npm/v/igata.svg?style=flat)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![CircleCI](https://circleci.com/gh/sakai-akinobu/igata.svg?style=svg)](https://circleci.com/gh/sakai-akinobu/igata)

Converts a JSON Schema to Flow type definitions.

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

convert({$id: 'Union', anyOf: [{type: 'string'}, {type: 'number'}]});
// => export type Union = string | number;

convert({$id: 'Array', type: 'array', items: {type: 'string'}});
// => export type Array = string[];

convert({$id: 'Tuple', type: 'array', items: [{type: 'string'}, {type: 'number'}]});
// => export type Tuple = [string, number];

convert({$id: 'Object', type: 'object', properties: {foo: {type: 'string'}}});
// => export type Object = {\n  foo?: string\n};
```

Following code is an example of nullable.

```javascript
const jsonSchema = {
  $id: 'Optional',
  anyOf: [
    {type: 'string'},
    {type: 'null'},
  ],
};
convert(jsonSchema);
// => export type Optional = string | null;
```

Following code is an example of [Exact object types](https://flow.org/en/docs/types/objects/#toc-exact-object-types).

```javascript
const jsonSchema = {
  $id: 'ExactObject',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
  },
};
convert(jsonSchema);
// => export type ExactObject = {|\n  name?: string\n|};
```

## Test

```
npm run test
```

## License

MIT license.
