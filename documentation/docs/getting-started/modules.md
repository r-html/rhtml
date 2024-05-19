---
sidebar_position: 1
---

# Modules

### Introduction

The `@Module()` decorator is used to define modules within your application. These modules help organize and encapsulate related functionality.

**Provider Registration**: Inside the `providers` array passed to `@Module()`, you list the various providers or services.
These providers could include any objects or services needed within the module.

**Dependency Injection Context**: By specifying providers within a module, you're registering them with the dependency injection (DI) system of `@rhtml`. This enables the framework to manage the creation and injection of dependencies throughout your application.

**Organizational Structure**: Using modules helps maintain a well-organized codebase, especially as the application grows. Each module in `@rhtml` could encapsulate a specific set of features or functionalities, making the codebase easier to understand and maintain.

### Defining a Module

```typescript
import { Module } from '@rhtml/di';

@Module({
  imports: [],
  providers: [],
  bootstraps: [],
})
export class AppModule {}
```

### Importing a module inside a module

```typescript
import { Module } from '@rhtml/di';

@Module()
export class MyModule {}

@Module({
  imports: [MyModule],
})
export class AppModule {}
```

### Importing a provider inside a module

```typescript
import { Module, Injectable } from '@rhtml/di';

@Injectable()
export class MyProvider {}

@Module({
  providers: [MyProvider],
})
export class AppModule {}
```

### Importing a provider inside a module using an custom `InjectionToken` and usage inside a Service Provider

```typescript
import { Module, Injectable, InjectionToken } from '@rhtml/di';

export const MyInjectable = new InjectionToken();

export type MyInjectable = { myValue: string };

@Module({
  providers: [
    {
      provide: MyInjectable,
      useFactory: () => ({ myValue: '1234' }),
    },
  ],
})
export class AppModule {}

@Injectable()
export class MyService {
  constructor(@Inject(MyInjectable) private myInjectable: MyInjectable) {}
}
```

### Importing a `Controller` using `@rhtml/fastify` package

```typescript
import { Module } from '@rhtml/di';
import { FastifyModule, Controller, Route } from '@rhtml/fastify';

@Module({
  imports: [
    FastifyModule.forRoot({
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
  healthCheck() {
    return {
      server: {
        status: 'working',
      },
    };
  }
}
```

### Bootstrap an application

```typescript
import { Module, Injectable, Bootstrap } from '@rhtml/di';

@Injectable()
export class MyProvider {}

@Module({
  providers: [MyProvider],
})
export class AppModule {}

Bootstrap(AppModule)
  .then(() => console.log('Application started'))
  .catch((e) => console.error(e));
```
