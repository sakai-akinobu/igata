// @flow
import * as types from '@babel/types';

import type {IntermediateSchema} from './types';

function parse(intermediateSchema: IntermediateSchema): Object {
  return types.exportNamedDeclaration(
    types.typeAlias(
      types.identifier(intermediateSchema.id),
      null,
      toFlowType(intermediateSchema),
    ),
    [],
  );
}

function toFlowType(intermediateSchema: IntermediateSchema): Object {
  if (intermediateSchema.type === 'any') {
    return types.anyTypeAnnotation();
  }
  if (intermediateSchema.type === 'null') {
    return types.nullLiteralTypeAnnotation();
  }
  if (intermediateSchema.type === 'boolean') {
    return types.booleanTypeAnnotation();
  }
  if (intermediateSchema.type === 'number') {
    return types.numberTypeAnnotation();
  }
  if (intermediateSchema.type === 'string') {
    return types.stringTypeAnnotation();
  }
  if (intermediateSchema.type === 'array') {
    return types.tupleTypeAnnotation(intermediateSchema.items.map(item => toFlowType(item)));
  }
  if (intermediateSchema.type === 'object') {
    return types.objectTypeAnnotation(Object.keys(intermediateSchema.properties).map(key => {
      return types.objectTypeProperty(
        types.identifier(key),
        toFlowType(intermediateSchema.properties[key])
      );
    }), null, null, null, !intermediateSchema.additionalProperties);
  }
  throw new TypeError(`An unexpected type was found. type: ${intermediateSchema.type}`);
}

export default parse;
