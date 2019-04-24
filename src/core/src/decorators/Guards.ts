import 'reflect-metadata';

export function Guards(...value: any[]): MethodDecorator {
  return (target: any, property: string | symbol, descriptor: PropertyDescriptor) => {
    const data = { functionName: property, guardList: value};
    const listMapping = Reflect.getMetadata('Guards', target) || [];
    listMapping.push(data);
    Reflect.defineMetadata('Guards', listMapping, target);
  };
}
