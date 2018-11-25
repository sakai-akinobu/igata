export type JSONSchemaType =
  | 'null'
  | 'boolean'
  | 'number'
  | 'integer'
  | 'string'
  | 'array'
  | 'object'
  ;

type Enum =
  | null
  | boolean
  | number
  | string
  | Object
  ;

export type EnumType = Enum | Enum[];

export interface JSONSchemaDefinition {
  [key: string]: JSONSchema;
}

export type JSONSchema = {
  $id?: string,
  $schema?: string,
  $ref?: string,
  definitions?: JSONSchemaDefinition,
  type?: JSONSchemaType | JSONSchemaType[],
  enum?: EnumType[],
  items?: JSONSchema | JSONSchema[],
  properties?: {[key: string]: JSONSchema},
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

export interface IntermediateSchema {
  id: string,
  type: IntermediateSchemaType | undefined,
  types: IntermediateSchemaType[],
  enum: EnumType[],
  itemType: IntermediateSchema | undefined,
  itemTypes: IntermediateSchema[],
  properties: {[key: string]: IntermediateSchema},
  required: string[],
  additionalProperties: boolean,
  anyOf: IntermediateSchema[],
  oneOf: IntermediateSchema[],
}
