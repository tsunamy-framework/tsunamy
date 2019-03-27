import "reflect-metadata";

export function QueryParam(key: string) {
  function pathParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
      let existingParameters: any[] = Reflect.getMetadata('QueryParam', target) || [];
      existingParameters.push({index: parameterIndex, key: key, functionName: propertyKey});
      Reflect.defineMetadata('QueryParam', existingParameters, target);
  }
  return pathParam;
}
