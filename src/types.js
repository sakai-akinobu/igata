// @flow
export type JSONSchemaType =
  | 'null'
  | 'boolean'
  | 'number'
  | 'integer'
  | 'string'
  | 'array'
  | 'object'
  ;

export type EnumType =
  | null
  | boolean
  | number
  | string
  | EnumType[]
  | Object
  ;

export type JSONSchemaDefinition = {
  [string]: JSONSchema,
};

export type JSONSchema = {
  $id?: string,
  $schema?: string,
  $ref?: string,
  definitions?: JSONSchemaDefinition,
  type?: JSONSchemaType | JSONSchemaType[],
  enum?: EnumType[],
  items?: JSONSchema | JSONSchema[],
  properties?: {[string]: JSONSchema},
  required?: string[],
  additionalProperties?: boolean,
  anyOf?: JSONSchema[],
  oneOf?: JSONSchema[],
};

export type IntermediateSchemaType =
  | 'any'
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  ;

export type IntermediateSchema = {|
  id: string,
  type: ?IntermediateSchemaType,
  types: IntermediateSchemaType[],
  enum: EnumType[],
  itemType: ?IntermediateSchema,
  itemTypes: IntermediateSchema[],
  properties: {[string]: IntermediateSchema},
  required: string[],
  additionalProperties: boolean,
  anyOf: IntermediateSchema[],
  oneOf: IntermediateSchema[],
|};
