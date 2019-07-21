import 'reflect-metadata';

interface MetaData {
  moduleId?: string;
  path?: string;
}

export function Controller(value?: MetaData): ClassDecorator {
  return (target: any) => {
      const data = Reflect.getMetadataKeys( target);
      Reflect.defineMetadata('Controller', value, target.prototype);
  };
}
