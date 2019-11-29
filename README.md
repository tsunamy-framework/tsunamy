[![npm version](https://badge.fury.io/js/tsunamy.svg)](//npmjs.com/package/tsunamy)
# Tsunamy framework

a node.ts framework, Alpha version.
Make easy to build a REST API server and serve a SPA

## Quick Start
go to [link](https://github.com/apokalupsis/tsunamyExemple) and download the project. Write your new routes in `src/api/app.controller.ts`, run `npm run start`, it will reload automatically on file change.

## Features

project architecture
```
src
  |-api (contain module, controller and service)
  |-config (contain the server config files)
  |-public (contain all the public files)
  main.ts (bootsrap the module)
```
if the request starts with `/api` the app checks the routes in the controller, otherwise, the app serves the static files on the public folder.

supports methods: `GET`, `POST`, `PUT` and `DELETE` with parameters in the route, query or body.

Example:
GET `api/custom/url/route/4?queryvar=blabla`
in the controller
```typescript
@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
customFunction(@PathParam('id') id: number, @QueryParam('queryvar', {notNull: true}) queryvar: string) {
  return queryvar + id;
}
```

Function can have this parameters :
@PathParam('name')
@QueryParam('name')
@Body()
@Response()

Options can be passed to @QueryParam.

## Guards

You can use Guards annotation for do some process fefore the fonction (exemple secure route).

```typescript
function isAdmin(request){ return true; }

@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
@Guards(isAdmin)
customFunction(@PathParam('id') id: number, @QueryParam('queryvar') queryvar: string) {
  return queryvar + id;
}
```

## Response

You can change the response manually, in the nodejs way.

```typescript
@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
customFunction(@Response() res: any) {
  res.setHeader('test', 'testValue')
  return '';
}
```

## ResponseEntity

This type is used to http response (http code + body). It's a class with generic body's type.

```typescript
function getById(id: number){ return new Object(); }

@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
customFunction(@PathParam('id') id: number): Promise<ResponseEntity<Object>> {
  return new ResponseEntity<>(getById(id));
}
```

## Log
You can log message in console and/or in file. There are 3 levels: INFO, WARN and ERROR

When we log with ERROR level the stack is added to the message.
```typescript
try {
  Log.Info('My message with INFO level');
  throw new Error()
} catch (e) {
  Log.Err('My message with ERROR level');
}
```

## https
change to https : true in the CONFIGURATION file
and add the two file to your projet
`/certificate/key.pem`
`/certificate/certificate.pem`
be careful this files are ignored by git (not commit)

Project link
[here](https://github.com/apokalupsis/tsunamy)

## more feature soon
