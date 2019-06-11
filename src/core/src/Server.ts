import { Configuration } from './types/Configuration';
import { Class } from './types/Class';
import { Router } from './Router';
import { Console } from './Console';
import fs from 'fs';
import https from 'https';
import http from 'http';

const MimeTypes: any = {
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  js: 'text/javascript',
  css: 'text/css'
};

export class Server {

  currentServerHttps: any;
  currentServerHttp: any;

  bootstrapModule(module: Class, CONFIGURATION: Configuration) {
    if (!CONFIGURATION.locale) {
      CONFIGURATION.locale = 'en-US';
    }

    function app(req: any, res: any): void {
      const bodyChunk: Uint8Array[] = [];
      let body: any;
      req.on('error', (err: any) => {
        console.error(err);
      }).on('data', (chunk: any) => {
        bodyChunk.push(chunk);
      }).on('end', async () => {
        const origins: string[] = CONFIGURATION.allowOrigins || [];
        const originHeader = req.headers.origin;
        const originIsAuthorized = origins.includes(originHeader);
        if (originHeader && originIsAuthorized) {
          res.setHeader('Access-Control-Allow-Origin', originHeader);
        }
        if (req.method === 'OPTIONS') {
          // Safari (and potentially other browsers) need content-length 0,
          //   for 204 or they just hang waiting for a body
          Console.Info('(Pre-flight request) Call : ' + req.method + ' ' + req.url);
          if (originIsAuthorized) {

            const methods: string[] = CONFIGURATION.allowMethods || [];
            const headers: string[] = CONFIGURATION.allowHeaders || [];

            const methodsAllowed = 'PUT,GET,POST,DELETE' + (methods.length > 0 ? ',' + methods.toString() : '');
            const headersAllowed = headers.length > 0 ? headers.toString() : '*';

            res.setHeader('Access-Control-Allow-Methods', methodsAllowed);
            res.setHeader('Access-Control-Allow-Headers', headersAllowed);
            res.setHeader('Content-Length', '0');
            res.statusCode = 200;
            res.end();
          } else {
            Console.Err('(Pre-flight request) Origin ' + originHeader + ' unknown');
            res.statusCode = 500;
            res.end();
          }
        } else {
          body = JSON.parse(Buffer.concat(bodyChunk).toString() || '{}');
          const route = Router.resolve(req.url, req.method);
          if (!route.error) {
            if (route.isStaticFile) {// If static files
              serveStaticFiles(req, res);
              return;
            }
            Console.Info('Call : ' + req.method + ' ' + req.url);
            // call function
            const result = await Router.executeRouteFunction(
                req,
                res,
                route.urlParam,
                route.queryParam,
                body,
                route.function,
                route.controllerInstance);
            backError(result, res);
            serveResponse(result, route, res);
            return;
          } else {
            backError(route, res);
          }
        }
      });
    }

    function backError(route: any, res: any): void {
      const error = route.error;
      if (error) {
        if (route.message) {
          if (typeof error === 'number' ) {
            res.statusCode = error;
            res.end(error + ' ' + route.message);
          } else {
            Console.Err('Status code type is incorrect');
            res.statusCode = 500;
            Console.Info('Response Code : ' + res.statusCode);
            res.end('500 Server Internal error.');
          }
        } else {
          Console.Info('Response Code : ' + error);
          switch (error) {
            case 400:
              res.statusCode = 400;
              res.end('400 Bad Request');
              break;
            case 401:
              res.statusCode = 401;
              res.end('401 Unauthorized');
              break;
            case 403:
              res.statusCode = 403;
              res.end('403 Forbidden');
              break;
            case 404:
              res.statusCode = 404;
              res.end('404 Route Not Found');
              break;
            case 405:
              res.statusCode = 405;
              res.end('405 Method Not Allowed');
              break;
            case 406:
              res.statusCode = 406;
              res.end('406 Not Acceptable');
              break;
            case 407:
              res.statusCode = 407;
              res.end('407 Proxy Authentication Required');
              break;
            case 408:
              res.statusCode = 408;
              res.end('408 Request Timeout');
              break;
            case 409:
              res.statusCode = 409;
              res.end('409 Conflict');
              break;
            case 410:
              res.statusCode = 410;
              res.end('410 Gone');
              break;
            case 411:
              res.statusCode = 411;
              res.end('411 Length Required');
              break;
            case 412:
              res.statusCode = 412;
              res.end('412 Precondition Failed');
              break;
            case 413:
              res.statusCode = 413;
              res.end('413 Payload Too Large');
              break;
            case 415:
              res.statusCode = 415;
              res.end('415 Unsupported Media Type');
              break;
            case 416:
              res.statusCode = 416;
              res.end('416 Requested Range Not Satisfiable');
              break;
            case 417:
              res.statusCode = 417;
              res.end('417 Expectation Failed');
              break;
            case 422:
              res.statusCode = 422;
              res.end('422 Unprocessable Entity ');
              break;
            case 426:
              res.statusCode = 426;
              res.end('426 Upgrade Required');
              break;
            case 428:
              res.statusCode = 428;
              res.end('428 Precondition Required');
              break;
            case 429:
              res.statusCode = 429;
              res.end('429 Too Many Requests');
              break;
            case 431:
              res.statusCode = 431;
              res.end('431 Request Header Fields Too Large');
              break;
            case 451:
              res.statusCode = 451;
              res.end('451 Unavailable For Legal Reasons');
              break;
            case 500:
              res.statusCode = 500;
              res.end('500 Internal Server Error');
              break;
            case 501:
              res.statusCode = 501;
              res.end('501 Not Implemented');
              break;
            case 502:
              res.statusCode = 502;
              res.end('502 Bad Gateway');
              break;
            case 503:
              res.statusCode = 503;
              res.end('503 Service Unavailable');
              break;
            case 504:
              res.statusCode = 504;
              res.end('504 Gateway Timeout');
              break;
            case 505:
              res.statusCode = 505;
              res.end('505 HTTP Version Not Supported');
              break;
            case 511:
              res.statusCode = 511;
              res.end('511 Network Authentication Required');
              break;
            default:
              res.statusCode = error;
              res.end(error + ' Error');
          }
        }
      }
    }

    function serveStaticFiles(req: any, res: any): void {
      if (req.url === '/') {// default index.html
        req.url = '/index.html';
      }
      const mimeType: string = MimeTypes[req.url.split('.')[1]];
      res.writeHead(200, mimeType);
      const filename = CONFIGURATION.projectDirectory + '/public' + req.url;
      const readStream = fs.createReadStream(filename);
      readStream.on('open', () => {
        readStream.pipe(res);
      });
      readStream.on('error', (err: any) => {
          if (err.code === 'ENOENT') {
              res.statusCode = 404;
              res.end('404 File not found');
          } else {
              res.statusCode = 500;
              res.end('Error ', err.Error);
          }
      });
    }

    function serveResponse(result: any, route: any, res: any): void {
    // get le retour et gerer les errors et creer response
    if (result.error) {
      backError(route, res);
    } else {
      if (result.code) {
        res.statusCode = result.code;
      } else {
        res.statusCode = 200;
      }
      Console.Info('Response Code : ' + res.statusCode);
      if (typeof result === 'string' ) {
        res.setHeader('Content-Type', 'text/plain');
        res.end('' + result);
        return;
      } else {
        if (typeof result === 'object' ) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
          return;
        } else {
          Console.Warn('Return type not found');
          backError({ error: 501, message: 'Return type not found' }, res);
        }
      }
    }
    }

    Console.setLocale(CONFIGURATION);
    Router.setConfig(CONFIGURATION);
    if (CONFIGURATION.http) {
      this.currentServerHttp = http.createServer(app);
      this.currentServerHttp.listen(CONFIGURATION.httpPort, CONFIGURATION.hostname, () => {
        Console.Info(`Tsunamy server running at http://${CONFIGURATION.hostname}:${CONFIGURATION.httpPort}/`);
      });
    }
    if (CONFIGURATION.https) {
      const privatekey = fs.readFileSync(CONFIGURATION.projectDirectory + '/certificate/key.pem', 'utf-8');
      const certificate = fs.readFileSync(CONFIGURATION.projectDirectory + '/certificate/certificate.pem', 'utf-8');
      this.currentServerHttps = https.createServer({key: privatekey, cert: certificate}, app);
      this.currentServerHttps.listen(CONFIGURATION.httpsPort, CONFIGURATION.hostname, () => {
        Console.Info(`Tsunamy https server running at https://${CONFIGURATION.hostname}:${CONFIGURATION.httpsPort}/`);
      });
    }
    Console.Blue(Console.LogoWithColor());
  }
}
