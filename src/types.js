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
  items?: JSONSchema[],
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
  items: IntermediateSchema[],
|};
