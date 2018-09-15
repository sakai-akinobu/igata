// @flow
import type {
  JSONSchema,
  IntermediateSchema,
} from './types';

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  return {$id: jsonSchema.$id};
}

export default compile;
