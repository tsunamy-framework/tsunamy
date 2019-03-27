import "reflect-metadata";
import { Injector } from "../Injector";
import { router } from "../router";

class ModuleWithProviders {
  providers?: any[]
  declarations?: any[]
  imports?: any[]
  exports?: any[]
  entryComponents?: any[]
  bootstrap?:any[]
  schemas?: any[]
  id?: string
};

let idVar = 0;

export function TsModule<T>(value: ModuleWithProviders): ClassDecorator {
  let injector: any;
  return (target: Function) => {
    value.id = idVar.toString();
    idVar++;
    injector = new Injector();
    if (value.declarations)
      value.declarations.map( (declaration) => {
        let controllerInstance = injector.resolve(declaration);
        Reflect.defineMetadata('moduleId', value.id, declaration);
        let routes = Reflect.getMetadata( 'RequestMapping', controllerInstance);
        routes.map( (route: any)=> {
          router.add(route.path, route.method,
            (req: any, res: any, urlParam: Map<string,any>, urlQueryParam: Map<string,any>, bodyParam: any) => {
              //call the function with good arguments
              let routeParam = Reflect.getMetadata('PathParam', controllerInstance ) || [];
              let queryParam = Reflect.getMetadata('QueryParam', controllerInstance ) || [];
              let body = Reflect.getMetadata('Body', controllerInstance ) || [];

              // calculate array size
              let arrayLength= urlParam.size;
              arrayLength = arrayLength + urlQueryParam.size;
              if(bodyParam)
                arrayLength = arrayLength ++;

              // create and feed the array
              let varParameters = new Array<any>(arrayLength);
              routeParam.map( (param: any)=> {
                if(param.functionName === route.function) {
                  varParameters[param.index] = urlParam.get(param.key);
                }
              });
              queryParam.map( (param: any)=> {
                if(param.functionName === route.function) {
                  varParameters[param.index] = urlQueryParam.get(param.key);
                }
              });
              body.map( (param: any)=> {
                if(param.functionName === route.function) {
                  varParameters[param.index] = bodyParam;
                }
              });

              // call function
              return injector.resolve(declaration)[route.function].apply(injector.resolve(declaration), varParameters);
            });
        })
      })
    }
}
