// @flow
import type {
  JSONSchema,
  IntermediateSchema,
} from './types';

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  const items = (jsonSchema.items || []).map(item => compile(item));
  return {
    id: jsonSchema.$id || '',
    type: jsonSchema.type || 'any',
    items,
  };
}

export default compile;
