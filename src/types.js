// @flow
type JSONSchemaType =
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  ;

export type JSONSchema = {
  $id?: string,
  $schema?: string,
  type?: JSONSchemaType,
  items?: JSONSchema | JSONSchema[],
  properties?: {[string]: JSONSchema},
  required?: string[],
  additionalProperties?: boolean,
};

type IntermediateSchemaType =
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
  type: IntermediateSchemaType,
  itemType: ?IntermediateSchema,
  itemTypes: IntermediateSchema[],
  properties: {[string]: IntermediateSchema},
  required: string[],
  additionalProperties: boolean,
|};
