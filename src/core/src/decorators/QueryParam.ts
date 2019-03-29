import 'reflect-metadata';

export function QueryParam(keyParam: string) {
  function pathParam(target: object, propertyKey: string | symbol, parameterIndex: number) {
      const existingParameters: any[] = Reflect.getMetadata('QueryParam', target) || [];
      existingParameters.push({index: parameterIndex, key: keyParam, functionName: propertyKey});
      Reflect.defineMetadata('QueryParam', existingParameters, target);
  }
  return pathParam;
}
