import "reflect-metadata";

export function Body(key: string) {
  function body(target: Object, propertyKey: string | symbol, parameterIndex: number) {
      let existingParameters: any[] = Reflect.getMetadata('Body', target) || [];
      existingParameters.push({index: parameterIndex, key: key, functionName: propertyKey});
      Reflect.defineMetadata('Body', existingParameters, target);
  }
  return body;
}
