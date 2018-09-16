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
  if (intermediateSchema.enum.length) {
    return types.unionTypeAnnotation(intermediateSchema.enum.map(e => {
      return types.genericTypeAnnotation(types.identifier(JSON.stringify(e)));
    }));
  }
  if (intermediateSchema.anyOf.length) {
    return types.unionTypeAnnotation(intermediateSchema.anyOf.map(any => toFlowType(any)));
  }
  if (intermediateSchema.type === 'array') {
    if (intermediateSchema.itemType) {
      return types.arrayTypeAnnotation(toFlowType(intermediateSchema.itemType));
    }
    return types.tupleTypeAnnotation(intermediateSchema.itemTypes.map(item => toFlowType(item)));
  }
  if (intermediateSchema.type === 'object') {
    return types.objectTypeAnnotation(Object.keys(intermediateSchema.properties).map(key => {
      const ast = types.objectTypeProperty(
        types.identifier(key),
        toFlowType(intermediateSchema.properties[key])
      );
      if (!intermediateSchema.required.includes(key)) {
        Object.assign(ast, {optional: true});
      }
      return ast;
    }), null, null, null, !intermediateSchema.additionalProperties);
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
  if (intermediateSchema.type === 'any') {
    return types.anyTypeAnnotation();
  }
  throw new TypeError(`An unexpected type was found. type: ${intermediateSchema.type}`);
}

export default parse;
