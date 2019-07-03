import 'reflect-metadata';

export function PutMapping(value: any): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    value.functionName = property;
    const listMapping = Reflect.getMetadata('PutMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('PutMapping', listMapping, target);
  };
}
