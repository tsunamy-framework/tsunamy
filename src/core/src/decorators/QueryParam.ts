import 'reflect-metadata';
import {QueryParam} from './options/QueryParam';
import {MdQueryParam} from '../types/Metadata/MdQueryParam';

export function QueryParam(keyParam: string, options?: QueryParam): ParameterDecorator {
  function pathParam(target: object, propertyKey: string | symbol, parameterIndex: number) {
    const existingParameters: MdQueryParam[] = Reflect.getMetadata('QueryParam', target) || [];
    existingParameters.push({
      index: parameterIndex,
      key: keyParam,
      functionName: propertyKey,
      options
    });
    Reflect.defineMetadata('QueryParam', existingParameters, target);
  }
  return pathParam;
}
