import 'reflect-metadata';

export function PathParam(keyParam: string) {
  function pathParam(target: object, propertyKey: string | symbol, parameterIndex: number) {
      const existingParameters: any[] = Reflect.getMetadata('PathParam', target) || [];
      existingParameters.push({index: parameterIndex, key: keyParam, functionName: propertyKey});
      Reflect.defineMetadata('PathParam', existingParameters, target);
  }
  return pathParam;
}
