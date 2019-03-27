import "reflect-metadata";
import { router } from "../router";

export function RequestMapping(value: any): MethodDecorator {
  return function (target: any, property: string | symbol, descriptor: PropertyDescriptor) {
    value.function = property;
    let listMapping = Reflect.getMetadata('RequestMapping', target) || [];
    listMapping.push(value);
    Reflect.defineMetadata('RequestMapping', listMapping, target);
  };
}
