import { Configuration } from './types/Configuration';
import { Class } from './types/Class';
import { Router } from './Router';
import { Log } from './Log';
import fs from 'fs';
import https from 'https';
import http, {IncomingMessage, ServerResponse} from 'http';
import {HttpStatus} from './http-status';

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

    function originIsAuthorized(originsAllowed: string[], originToCheck: string | string[]): boolean {
      if (typeof originToCheck === 'string') {
        return originsAllowed.includes(originToCheck);
      } else {
        for (const origin of originToCheck) {
          if (originsAllowed.includes(origin)) {
            return true;
          }
        }
        return false;
      }
    }

    function app(req: IncomingMessage, res: ServerResponse): void {
      const bodyChunk: Uint8Array[] = [];
      let body: any;
      req.on('error', (err: any) => {
        console.error(err);
      }).on('data', (chunk: any) => {
        bodyChunk.push(chunk);
      }).on('end', async () => {
        const originsAllowed: string[] = CONFIGURATION.allowOrigins || [];
        const originHeader = req.headers.origin;
        const isAuthorized = originHeader && originIsAuthorized(originsAllowed, originHeader);
        if (originHeader && isAuthorized) {
          res.setHeader('Access-Control-Allow-Origin', originHeader);
        }
        if (req.method === 'OPTIONS') {
          // Safari (and potentially other browsers) need content-length 0,
          //   for 204 or they just hang waiting for a body
          Log.info('(Pre-flight request) Call : ' + req.method + ' ' + req.url);
          if (isAuthorized) {

            const methods: string[] = CONFIGURATION.allowMethods || [];
            const headers: string[] = CONFIGURATION.allowHeaders || [];

            const methodsAllowed = 'PUT,GET,POST,DELETE' + (methods.length > 0 ? ',' + methods.toString() : '');
            const headersAllowed = headers.length > 0 ? headers.toString() : '*';

            res.setHeader('Access-Control-Allow-Methods', methodsAllowed);
            res.setHeader('Access-Control-Allow-Headers', headersAllowed);
            res.setHeader('Content-Length', '0');
            res.statusCode = HttpStatus.OK.getCode();
            res.end();
          } else {
            Log.err('(Pre-flight request) Origin ' + originHeader + ' unknown');
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR.getCode();
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
            Log.info('Call : ' + req.method + ' ' + req.url);
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
            Log.err('Status code type is incorrect');
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR.getCode();
            Log.info('Response Code : ' + res.statusCode);
            res.end(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
          }
        } else {
          Log.info('Response Code : ' + error);
          const httpStatus = HttpStatus.getValueOf(error);
          if (httpStatus) {
            res.statusCode = httpStatus.getCode();
            res.end(httpStatus.getReasonPhrase());
          } else {
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
      let extension = req.url.substring(req.url.lastIndexOf('.') + 1);
      if (extension) {
        extension = extension.toLowerCase();
      }
      const mimeType: string = MimeTypes[extension];
      res.writeHead(HttpStatus.OK.getCode(), mimeType);
      const filename = CONFIGURATION.projectDirectory + '/public' + req.url;
      Log.info('Serve static files : file name : ' + filename + ' mime type ' + mimeType);
      const readStream = fs.createReadStream(filename);
      readStream.on('open', () => {
        readStream.pipe(res);
      });
      readStream.on('error', (err: any) => {
          if (err.code === 'ENOENT') {
              res.statusCode = HttpStatus.NOT_FOUND.getCode();
              res.end(HttpStatus.NOT_FOUND.getReasonPhrase());
          } else {
              res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR.getCode();
              res.end(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
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
        res.statusCode = HttpStatus.OK.getCode();
      }
      Log.info('Response Code : ' + res.statusCode);
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
          Log.warn('Return type not found');
          backError({ error: HttpStatus.NOT_IMPLEMENTED.getCode(), message: 'Return type not found' }, res);
        }
      }
    }
    }

    Log.setLocale(CONFIGURATION);
    Log.initLog(CONFIGURATION);
    Router.setConfig(CONFIGURATION);
    if (CONFIGURATION.http) {
      this.currentServerHttp = http.createServer(app);
      this.currentServerHttp.listen(CONFIGURATION.httpPort, CONFIGURATION.hostname, () => {
        Log.info(`Tsunamy server running at http://${CONFIGURATION.hostname}:${CONFIGURATION.httpPort}/`);
      });
    }
    if (CONFIGURATION.https) {
      const privatekey = fs.readFileSync(CONFIGURATION.projectDirectory + '/certificate/key.pem', 'utf-8');
      const certificate = fs.readFileSync(CONFIGURATION.projectDirectory + '/certificate/certificate.pem', 'utf-8');
      this.currentServerHttps = https.createServer({key: privatekey, cert: certificate}, app);
      this.currentServerHttps.listen(CONFIGURATION.httpsPort, CONFIGURATION.hostname, () => {
        Log.info(`Tsunamy https server running at https://${CONFIGURATION.hostname}:${CONFIGURATION.httpsPort}/`);
      });
    }
    Log.blue(Log.logoWithColor());
  }
}
