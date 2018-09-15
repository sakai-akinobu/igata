// @flow
import generate from '@babel/generator';

import compile from './compile';
import parse from './parse';
import type {JSONSchema} from './types';

export function convert(jsonSchema: JSONSchema): string {
  const intermediateSchema = compile(jsonSchema);
  const ast = parse(intermediateSchema);
  return generate(ast).code;
}

export default {convert};
