---
sidebar_position: 3
---

# Controllers

### Introduction

In the context of the `@rhtml/fastify` package, the `@Controller` decorator plays a role similar to other web framework libraries like Express or NestJS. Here's an explanation of what `@Controller` is and how it's used:

**Controller Definition**: The `@Controller` decorator is used to define a controller within your application. Controllers are responsible for handling incoming HTTP requests and returning appropriate responses.

**Routing**: Controllers typically define routes for different HTTP methods (e.g., GET, POST, PUT, DELETE). Each route is associated with a specific endpoint URL and handler function within the controller.

**Request Handling**: When a request matches a route defined by a controller, the corresponding handler function is invoked to process the request. Inside the handler function, you can access request parameters, headers, body, and other data, and perform any necessary processing or business logic.

**Response Generation**: Controller handler functions are responsible for generating and returning HTTP responses to the client. This includes setting response headers, status codes, and sending back data or content in the response body.

**Middleware Support**: Controllers in `@rhtml/fastify` may support the use of middleware functions to intercept and process requests before they reach the controller handler functions. This allows for common functionality such as authentication, logging, or input validation to be applied to multiple routes within the controller.

**Organizational Structure**: Controllers help to organize your application's routes and request handling logic into logical units based on functionality or resource type. This improves code readability, maintainability, and scalability.

In summary, the `@Controller` decorator in `@rhtml/fastify` is used to define HTTP request handlers and routes within your application, facilitating the development of web APIs or server-side applications.

### Basic controller

```typescript
import { Module } from '@rhtml/di';
import { FastifyModule, Controller, Route } from '@rhtml/fastify';
import fastify from 'fastify';

@Module({
  imports: [
    FastifyModule.forRoot(fastify, {
      server: {
        port: 3000,
        host: 'localhost',
      },
    }),
  ],
  bootstraps: [HealthCheckController],
})
export class AppModule {}

@Controller({
  route: '/status',
})
export class HealthCheckController {
  @Route({
    method: 'GET',
  })
  healthCheck(
    request: FastifyRequest<{
      Params: { myParams: string };
      Body: { myBody: string };
      Querystring: { myQueryString: string };
    }>
  ) {
    request.body.myBody;
    request.query.myQueryString;
    request.params.myParams;
    return {
      server: {
        status: 'working',
      },
    };
  }
}
```

### Defining a custom JSON Schema to validate request parameters

```typescript
import { Controller, Route } from '@rhtml/fastify';

@Controller({
  route: '/status',
})
export class HealthCheckController {
  @Route({
    method: 'GET',
    schema: {
      body: {
        $id: 'MyBody.json',
        title: 'MyBody',
        type: 'object',
        properties: {},
        required: [],
      },
      response: {
        200: {
          $id: 'MyResponse.json',
          title: 'MyResponse',
          type: 'object',
          properties: {
            status: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['status'],
        },
      },
    },
  })
  myRequest(
    request: FastifyRequest<{
      Body: { myBody: string };
    }>
  ) {
    return {
      status: 'working',
    };
  }
}
```

### Defining a `path` parameter

```typescript
import { Controller, Route } from '@rhtml/fastify';
import { FastifyRequest } from 'fastify';

@Controller({
  route: '/status',
})
export class MyCustomController {
  @Route({
    method: 'GET',
    url: '/:myParam',
  })
  myRequest(
    request: FastifyRequest<{
      Params: { myParam: string };
    }>
  ) {
    request.params.myParam;
    return {
      status: 'working',
    };
  }
}
```
