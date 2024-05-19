---
sidebar_position: 2
---

# Providers

### Introduction

**Service Declaration**: The `@Injectable` decorator is used to declare a class as a service within your application. Services typically encapsulate reusable functionality, such as data access, logging, or business logic.

**Dependency Injection Support**: When a class is decorated with `@Injectable`, it signals to the dependency injection container that instances of this class may be injected into other classes or components within your application. This allows you to use dependency injection to manage the instantiation and lifecycle of the service.

**Constructor Injection**: Services decorated with `@Injectable` typically utilize constructor injection to receive their dependencies. This promotes loose coupling and makes the service easier to test.

**Providing Dependencies**: Services decorated with `@Injectable` can have their dependencies automatically resolved and injected by the dependency injection container. This simplifies the process of managing dependencies and promotes modular, reusable code.

**Lifecycle Management**: Services decorated with `@Injectable` support lifecycle hooks such as initialization, destruction. These hooks allow you to perform setup or cleanup tasks when the service is created or destroyed.

### Defining a `class` Provider

```typescript
import { Injectable } from '@rhtml/di';

@Injectable()
export class MyProvider {
  myMethod() {
    return 'Hello World';
  }
}
```

### Importing `InjectionToken` into a Provider, first we need to define it in the respective Module

> NOTE: Custom injection tokens can be also `async` by using `useFactory: async () => ({ myValue: '1234' })`

> NOTE: When injection token is `async` the application will not Bootstrap until every `async` provider returns value

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
export class MyProvider {
  constructor(@Inject(MyInjectable) private myInjectable: MyInjectable) {}

  myMethod() {
    return this.myInjectable.myValue; // '1234'
  }
}
```

### Usage of Providers

```typescript
import { Module, Injectable, InjectionToken } from '@rhtml/di';

@Module({
  providers: [MyProvider, MyProviderSecond],
})
export class AppModule {}

@Injectable()
export class MyProvider {
  myMethod() {
    return '1234';
  }
}

@Injectable()
export class MyProviderSecond {
  constructor(private myProvider: MyProvider) {}
  myMethod() {
    return '1234';
  }
}
```

### Hooks

```typescript
import { Injectable, OnInit, OnDestroy } from '@rhtml/di';

@Injectable()
export class MyClass implements OnInit, OnDestroy {
  OnInit() {
    // When class is instantiated
  }
  OnDestroy() {
    // When class is about to be removed from the DI container
  }
}
```
