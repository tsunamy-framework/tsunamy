import 'reflect-metadata';

class MetaData {
  moduleId?: string
};

export function Controller(value?: MetaData): ClassDecorator {
  return (target: Function) => {
      let data = Reflect.getMetadataKeys( target);
    }
}
