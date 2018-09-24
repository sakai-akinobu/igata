// @flow
import type {IntermediateSchema} from './types';

const types = require('@babel/types');

function parse(schema: IntermediateSchema): Object {
  return types.exportNamedDeclaration(
    types.typeAlias(
      types.identifier(schema.id),
      null,
      toFlowType(schema),
    ),
    [],
  );
}

function toFlowType(schema: IntermediateSchema): Object {
  if (schema.anyOf.length) {
    return types.unionTypeAnnotation(schema.anyOf.map(schema => toFlowType(schema)));
  }
  if (schema.oneOf.length) {
    return types.unionTypeAnnotation(schema.oneOf.map(schema => toFlowType(schema)));
  }

  if (schema.enum.length) {
    return types.unionTypeAnnotation(schema.enum.map(e => {
      return types.genericTypeAnnotation(types.identifier(JSON.stringify(e)));
    }));
  }

  if (schema.types.length) {
    return types.unionTypeAnnotation(schema.types.map(type => {
      return toFlowType({
        ...schema,
        type,
        types: [],
      });
    }));
  }

  if (schema.type === 'array') {
    if (schema.itemType) {
      return types.arrayTypeAnnotation(toFlowType(schema.itemType));
    }
    return types.tupleTypeAnnotation(schema.itemTypes.map(item => toFlowType(item)));
  }

  if (schema.type === 'object') {
    return types.objectTypeAnnotation(Object.keys(schema.properties).map(key => {
      const ast = types.objectTypeProperty(
        types.identifier(key),
        toFlowType(schema.properties[key])
      );
      if (!schema.required.includes(key)) {
        Object.assign(ast, {optional: true});
      }
      return ast;
    }), null, null, null, !schema.additionalProperties);
  }

  switch (schema.type) {
  case 'null':
    return types.nullLiteralTypeAnnotation();
  case 'boolean':
    return types.booleanTypeAnnotation();
  case 'number':
    return types.numberTypeAnnotation();
  case 'string':
    return types.stringTypeAnnotation();
  case 'any':
    return types.anyTypeAnnotation();
  }

  throw new TypeError(`An unexpected type was found. type: ${String(schema.type)}`);
}

export default parse;
