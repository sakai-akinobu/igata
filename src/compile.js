// @flow
import type {
  JSONSchema,
  IntermediateSchema,
} from './types';

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  const items = (jsonSchema.items || []).map(item => compile(item));
  const properties = Object.keys((jsonSchema.properties || {})).reduce((props, key) => {
    props[key] = compile((jsonSchema.properties || {})[key]);
    return props;
  }, {});
  const additionalProperties = typeof jsonSchema.additionalProperties === 'undefined' ? true : Boolean(jsonSchema.additionalProperties);
  return {
    id: jsonSchema.$id || '',
    type: jsonSchema.type || 'any',
    items,
    properties,
    additionalProperties,
  };
}

export default compile;
