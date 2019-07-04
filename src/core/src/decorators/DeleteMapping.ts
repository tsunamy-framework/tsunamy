import 'reflect-metadata';

export function DeleteMapping(value?: any): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    value = value || {};
    value.functionName = property;
    const listMapping = Reflect.getMetadata('DeleteMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('DeleteMapping', listMapping, target);
  };
}
