import "reflect-metadata";

export function PathParam(key: string) {
  function pathParam(target: Object, propertyKey: string | symbol, parameterIndex: number) {
      let existingParameters: any[] = Reflect.getMetadata('PathParam', target) || [];
      existingParameters.push({index: parameterIndex, key: key, functionName: propertyKey});
      Reflect.defineMetadata('PathParam', existingParameters, target);
  }
  return pathParam;
}
