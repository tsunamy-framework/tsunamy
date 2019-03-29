
import { Console } from './Console';

interface RouteObj {
  path: string[];
  function: any;
}
const globalRouteList: Map<string, RouteObj[]> =
new Map().set('GET', []).set('POST', []).set('PUT', []).set('DELETE', []);
let CONFIGURATION: any;

export class Router {

  static setConfig(newCONFIGURATION: any) {
    CONFIGURATION = newCONFIGURATION;
  }

  static add(url: string, method: string, f: any): any {
    const newList: RouteObj[] = globalRouteList.get(method) || [];
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    newList.push({ path: ['api', ...url.split('/')], function: f});
    globalRouteList.set(method, newList );
  }

  static resolve(url: string = '', method: string = ''): any {
    try {
      const routeList: RouteObj[] = globalRouteList.get(method) || [];
      if (url.startsWith('/')) {
        url = url.substr(1);
      }
      const arrayUrl = url.split('/');
      // if API
      if (arrayUrl[0] === CONFIGURATION.pathAPI) {
        const arrayQuery = arrayUrl[arrayUrl.length - 1].split('?'); // save the query param
        arrayUrl[arrayUrl.length - 1] = arrayQuery[0]; // replace the query param
        let n = 0;
        do {
          if ( this.pathMatch(routeList[n].path, arrayUrl)) { // if path match get the params
            return {
              function: routeList[n].function,
              urlParam: this.extractVarFromPath(routeList[n].path, arrayUrl),
              queryParam: this.extractVarFromQuery(arrayQuery[1])
            };
          }
          n++;
        } while (n < routeList.length);
        Console.Warn('route not found');
        return { error: 404};
      } else { // if Static files
        return {
          isStaticFile: true,
          urlArray: arrayUrl
        };
      }
    } catch (e) {
      Console.Err('Resolve error, ' + e);
      return { error: 500};
    }
  }

  private static pathMatch(path: Array<string>, pathToTest: Array<string>): boolean {
    let i = path.length;
    if (path.length !== pathToTest.length) {
      return false;
    }
    while (i--) {
      if ( path[i] !== pathToTest[i] && !path[i].startsWith('{')) {
        return false;
      }
    }
    return true;
  }

  private static extractVarFromPath(path: Array<string>, pathWithVarToExtract: Array<string>): Map<string, any> {
    const varList = new Map();
    let i = path.length;
    while (i--) {
      if (path[i].startsWith('{')) {
        const keyVar = path[i];
        varList.set(keyVar.substr(1, keyVar.length - 2), pathWithVarToExtract[i]);
      }
    }
    return varList;
  }

  private static extractVarFromQuery(queryWithVarToExtract: string): Map<string, any> {
    const varList = new Map();
    if (queryWithVarToExtract) {
      const queryWithVar = queryWithVarToExtract.split(',');
      let i = queryWithVar.length;
      while (i--) {
        varList.set(queryWithVar[i].split('=')[0], queryWithVar[i].split('=')[1]);
      }
    }
    return varList;
  }
}
