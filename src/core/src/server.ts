import { Configuration } from './types/Configuration';
import { Class } from './types/Class';
import { router } from './router';
import { Console } from './Console';
import fs from 'fs';

var MimeTypes: any = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'};

export class server {

  currentServer: any;

  async bootstrapModule (module : Class, CONFIGURATION: Configuration) {

    router.setConfig(CONFIGURATION);
    let http: any;
    if(CONFIGURATION.https) {
      http = await import('https');
      Console.Err('HTTPS not supported now.');
    } else {
      http = await import('http');
    }

    this.currentServer = http.createServer((req: any, res: any) => {
      new module();
      let bodyChunk: any[]= [];
      let body: any;
      req.on('error', (err: any) => {
        console.error(err);
      }).on('data', (chunk: any) => {
        bodyChunk.push(chunk);
      }).on('end', () => {
        body = JSON.parse(Buffer.concat(bodyChunk).toString() || '{}');
        let route = router.resolve(req.url, req.method);
        if(!route.error){
          if(route.isStaticFile) {// If static files
            if(req.url === '/'){// default index.html
              req.url= '/index.html';
            }
            var mimeType:string = MimeTypes[req.url.split(".")[1]];
            res.writeHead(200, mimeType);

            var filename = CONFIGURATION.projectDirectory + '/public' +req.url;
            var readStream = fs.createReadStream(filename);

            readStream.on('open', function () {
              readStream.pipe(res);
            });
            readStream.on('error', function(err:any) {
              res.end(err);
            });
            return;
          }
          // call function
          let result = route.function(req, res, route.urlParam, route.queryParam, body);
          //get le retour et gerer les errors et creer resoponse
          if(result.error) {
            backError(route.error, res);
          } else {
            if(result.code){
              res.statusCode = result.code;
            } else {
              res.statusCode = 200;
            }
            if(typeof result === "string" ) {
              res.setHeader('Content-Type', 'text/plain');
              res.end(result);
            } else {
              if(typeof result === "object" ) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
              } else {
                res.write('retour type not found')
                backError(501, res);
              }
            }
          }
        } else {
          backError(route.error, res);
        }
      });
    });

    function backError(error : number, res: any): void {
        if(error === 404) {
          res.statusCode = 404;
          res.end('404 Route Not Found');
        }
        if(error === 500) {
          res.statusCode = 500;
          res.end('500 Server Internal error.');
        }
    }

    this.currentServer.listen(CONFIGURATION.port, CONFIGURATION.hostname, () => {
      Console.Blue(Console.LogoWithColor());
      Console.Info(`Tsunamy server running at http://${CONFIGURATION.hostname}:${CONFIGURATION.port}/`);
    });

  };
}
