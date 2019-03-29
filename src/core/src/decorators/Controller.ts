import 'reflect-metadata';

interface MetaData {
  moduleId?: string;
}

export function Controller(value?: MetaData): ClassDecorator {
  return (target: any) => {
      const data = Reflect.getMetadataKeys( target);
    };
}
