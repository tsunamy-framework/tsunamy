import 'reflect-metadata';
import {Injector} from '../Injector';
import {Router} from '../Router';

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
        addRoutes(controllerInstance, 'RequestMapping', null);
        addRoutes(controllerInstance, 'GetMapping', 'GET');
        addRoutes(controllerInstance, 'PostMapping', 'POST');
        addRoutes(controllerInstance, 'PutMapping', 'PUT');
        addRoutes(controllerInstance, 'DeleteMapping', 'DELETE');
      });
    }
  };
}

function addRoutes(controllerInstance: any, metadataKey: string, method: string | null) {
  const metadatas = Reflect.getMetadata('Controller', controllerInstance);
  let controllerPath = '';
  if (metadatas && metadatas.path) {
    controllerPath = metadatas.path;
  }

  const routes = Reflect.getMetadata(metadataKey, controllerInstance) || [];
  routes.map( (route: any) => {
    Router.add(buildPath(controllerPath, route.path), (method ? method : route.method), route.functionName, controllerInstance);
  });
}

function buildPath(controllerPath: string, routePath: string): string {
  let routePathCalculated = '';
  if (routePath && routePath !== '') {
    routePathCalculated = routePath.startsWith('/') ? routePath : '/' + routePath;
  }
  return controllerPath + routePathCalculated;
}
