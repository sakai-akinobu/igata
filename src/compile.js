// @flow
import type {
  JSONSchema,
  IntermediateSchema,
} from './types';

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  let itemTypes = [], itemType = null;
  if (Array.isArray(jsonSchema.items)) {
    itemTypes = (jsonSchema.items || []).map(item => compile(item));
  } else if (typeof jsonSchema.items === 'object') {
    itemType = compile(jsonSchema.items);
  }
  const properties = Object.keys((jsonSchema.properties || {})).reduce((props, key) => {
    props[key] = compile((jsonSchema.properties || {})[key]);
    return props;
  }, {});
  const additionalProperties = typeof jsonSchema.additionalProperties === 'undefined' ? true : Boolean(jsonSchema.additionalProperties);
  return {
    id: jsonSchema.$id || '',
    type: jsonSchema.type || 'any',
    enum: jsonSchema.enum || [],
    itemType,
    itemTypes,
    properties,
    required: jsonSchema.required || [],
    additionalProperties,
    anyOf: (jsonSchema.anyOf || []).map(any => compile(any)),
  };
}

export default compile;
