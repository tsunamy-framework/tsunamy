import 'reflect-metadata';

export function Response(keyParam?: string) {
  function response(target: object, propertyKey: string | symbol, parameterIndex: number) {
      const existingParameters: any[] = Reflect.getMetadata('Response', target) || [];
      existingParameters.push({index: parameterIndex, key: keyParam, functionName: propertyKey});
      Reflect.defineMetadata('Response', existingParameters, target);
  }
  return response;
}
