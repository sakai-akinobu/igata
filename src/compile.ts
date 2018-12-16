import {
  JSONSchema,
  JSONSchemaType,
  JSONSchemaDefinition,
  IntermediateSchema,
  IntermediateSchemaType,
} from './types';

function convertToFlowType(type: JSONSchemaType | undefined): IntermediateSchemaType {
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

function getDefinition(definitions: JSONSchemaDefinition, definitionKey: string): JSONSchema | undefined {
  return definitions[`${definitionKey.replace('#/definitions/', '')}`];
}

function compile(jsonSchema: JSONSchema, definitions: JSONSchemaDefinition = {}): IntermediateSchema {
  if (jsonSchema.$ref) {
    const definition = getDefinition(definitions, jsonSchema.$ref);
    if (!definition) {
      throw new Error(`JSON Schema definition was not found. ${String(jsonSchema.$ref)}`);
    }
    return compile({
      ...jsonSchema,
      $ref: '',
      ...definition,
    }, definitions);
  }

  let types = [];
  let type = null;
  if (Array.isArray(jsonSchema.type)) {
    types = jsonSchema.type.map(t => convertToFlowType(t));
  } else {
    type = convertToFlowType(jsonSchema.type);
  }

  let itemTypes = [];
  let itemType = null;
  if (Array.isArray(jsonSchema.items)) {
    itemTypes = (jsonSchema.items || []).map(item => compile(item, definitions));
  } else if (typeof jsonSchema.items === 'object') {
    itemType = compile(jsonSchema.items, definitions);
  }

  const properties = Object.keys((jsonSchema.properties || {})).reduce((props, key) => {
    props[key] = compile((jsonSchema.properties || {})[key], definitions);
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
    anyOf: (jsonSchema.anyOf || []).map(schema => compile(schema, definitions)),
    oneOf: (jsonSchema.oneOf || []).map(schema => compile(schema, definitions)),
  };
}

export default compile;
