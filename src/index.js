// @flow
import generate from '@babel/generator';

import compile from './compile';
import parse from './parse';
import type {JSONSchema} from './types';

export function convert(jsonSchema: JSONSchema): string {
  if (typeof jsonSchema !== 'object' || Array.isArray(jsonSchema)) {
    throw new Error('Argument must be an object.');
  }

  const intermediateSchema = compile(jsonSchema);
  const ast = parse(intermediateSchema);
  return generate(ast).code;
}

export default {convert};
