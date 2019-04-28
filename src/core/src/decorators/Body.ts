import 'reflect-metadata';

export function Body(keyParam?: string) {
  function body(target: object, propertyKey: string | symbol, parameterIndex: number) {
      const existingParameters: any[] = Reflect.getMetadata('Body', target) || [];
      existingParameters.push({index: parameterIndex, key: keyParam, functionName: propertyKey});
      Reflect.defineMetadata('Body', existingParameters, target);
  }
  return body;
}
