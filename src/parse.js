// @flow
import * as types from '@babel/types';

import type {IntermediateSchema} from './types';

function parse(intermediateSchema: IntermediateSchema): Object {
  return types.exportNamedDeclaration(
    types.typeAlias(
      types.identifier(intermediateSchema.$id),
      null,
      types.anyTypeAnnotation(),
    ),
    [],
  );
}

export default parse;
