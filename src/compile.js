// @flow
import type {
  JSONSchema,
  JSONSchemaType,
  IntermediateSchema,
  IntermediateSchemaType,
} from './types';

function convertToFlowType(type: ?JSONSchemaType): IntermediateSchemaType {
  switch (type) {
  case 'null':
  case 'boolean':
  case 'number':
  case 'string':
  case 'object':
  case 'array':
    return type;
  case 'integer':
    return 'number'; // Integer type does not exist in Flow.
  default:
    return 'any';
  }
}

function compile(jsonSchema: JSONSchema): IntermediateSchema {
  let types = [], type = null;
  if (Array.isArray(jsonSchema.type)) {
    types = jsonSchema.type.map(type => convertToFlowType(type));
  } else {
    type = convertToFlowType(jsonSchema.type);
  }
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
    type,
    types,
    enum: jsonSchema.enum || [],
    itemType,
    itemTypes,
    properties,
    required: jsonSchema.required || [],
    additionalProperties,
    anyOf: (jsonSchema.anyOf || []).map(schema => compile(schema)),
    oneOf: (jsonSchema.oneOf || []).map(schema => compile(schema)),
  };
}

export default compile;
