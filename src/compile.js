// @flow
import type {
  JSONSchema,
  IntermediateSchema,
} from './types';

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  return {
    id: jsonSchema.$id || '',
    type: jsonSchema.type || 'any',
  };
}

export default compile;
