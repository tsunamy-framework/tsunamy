import 'reflect-metadata';

export function GetMapping(value?: any): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    value = value || {};
    value.functionName = property;
    const listMapping = Reflect.getMetadata('GetMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('GetMapping', listMapping, target);
  };
}
