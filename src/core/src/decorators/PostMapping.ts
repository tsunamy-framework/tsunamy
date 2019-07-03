import 'reflect-metadata';

export function PostMapping(value: any): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    value.functionName = property;
    const listMapping = Reflect.getMetadata('PostMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('PostMapping', listMapping, target);
  };
}
