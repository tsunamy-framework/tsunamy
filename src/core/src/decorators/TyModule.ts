import 'reflect-metadata';
import { Injector } from '../Injector';
import { Router } from '../Router';

class ModuleWithProviders {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  exports?: any[];
  entryComponents?: any[];
  bootstrap?: any[];
  schemas?: any[];
  id?: string;
}

let idVar = 0;

export function TyModule<T>(value: ModuleWithProviders): ClassDecorator {
  let injector: any;
  return (target: any ) => {
    value.id = idVar.toString();
    idVar++;
    injector = new Injector();
    if (value.declarations) {
      value.declarations.map( (declaration) => {
        const controllerInstance = injector.resolve(declaration);
        Reflect.defineMetadata('moduleId', value.id, declaration);
        const routes = Reflect.getMetadata( 'RequestMapping', controllerInstance) || [];
        routes.map( (route: any) => {
          Router.add(route.path, route.method, route.functionName, controllerInstance);
          });
        });
      }
    };
  }
