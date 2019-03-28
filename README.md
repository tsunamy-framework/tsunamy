# Tsunamy framework

a node.ts framework, Alpha version.

## Quick Start
go to [link](https://github.com/apokalupsis/tsunamyExemple) and download the project.
write your new routes in `src/api/app.controller.ts`
start with `npm run start` for start with reload automatically on files change.

## Features

project architecture
```
src
  |-api (contain module, controller and service)
  |-config (contain the server config files)
  |-public (contain all the public files)
  main.ts (bootsrap the module)
```
if the request start with `/api` the app check the route in controller
if the request don't start with `/api` the app will serve the static files on the public folder.

support `GET` `POST` `PUT` `DELETE` method with parameter in route, query, body.

Exemple:
GET `api/custom/url/route/{id}?queryvar=blabla`
in the controller
```typescript
@RequestMapping({ path:"/custom/url/route/{id}", method: 'GET'})
customFunction(@PathParam('id') id: number, @QueryParam('queryvar') queryvar: string) {
  return queryvar + id;
}
```

Project link
[here](https://github.com/apokalupsis/tsunamy)

## more feature soon
