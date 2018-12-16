import generate from '@babel/generator';

import compile from './compile';
import parse from './parse';
import {JSONSchema} from './types';

export function convert(jsonSchema: JSONSchema): string {
  if (
    typeof jsonSchema !== 'object' ||
    Array.isArray(jsonSchema) ||
    jsonSchema === null
  ) {
    throw new Error('Argument must be an object.');
  }

  const intermediateSchema = compile(jsonSchema, jsonSchema.definitions);
  if (intermediateSchema.id === '') {
    throw new Error('Root JSON Schema required $id property. It is treated as the name of Flow type definition.');
  }

  const ast = parse(intermediateSchema);
  return generate(ast).code;
}
