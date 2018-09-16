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
import assert from 'assert';

const jsonSchema = {
  $id: 'User',
  type: 'object',
  required: [
    'name',
  ],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
};

const flowTypeDefinition = convert(jsonSchema);

const expected = `export type User = {|
  name: string,
  age?: number,
|};`
assert.strictEqual(flowTypeDefinition, expected);
```

## Test

```
npm run test
```

## License

MIT license.
