import 'reflect-metadata';

export function RequestMapping(value: any): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    value.functionName = property;
    const listMapping = Reflect.getMetadata('RequestMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('RequestMapping', listMapping, target);
  };
}
