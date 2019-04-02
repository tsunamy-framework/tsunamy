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

Exemple:
GET `api/custom/url/route/4?queryvar=blabla`
in the controller
```typescript
@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
customFunction(@PathParam('id') id: number, @QueryParam('queryvar') queryvar: string) {
  return queryvar + id;
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
