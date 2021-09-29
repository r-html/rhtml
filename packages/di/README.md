# @rhtml/di

Smallest Dependency Injection for Typescript and Javascript!

- Only `1.42kb` bundled size without Reflection, `2.49kb` with `@abraham/reflection`;
- Decorators available inside `@rhtml/di/module` `Module`, `Component`
- Hooks available `OnInit`, `OnDestroy` `class { OnDestroy() {} OnInit() {} }`
- 100% Code coverage and branches
- No dependencies
- Works with [`deno`](https://deno.land/)

#### Installation

```bash
npm i @rhtml/di
```

#### Usage

```ts
import { Inject, Injectable } from '@rhtml/di';

class Test {
  test = 42;
}
@Injectable()
class Test2 {
  constructor(@Inject(Test) public test: Test) {}
}
const test2 = set(Test2);
console.log(test2.test.test); // 42
```

#### With `Deno` using `esm.sh` as a `cdn`

Example can be found [here](./example/deno)
Deno land https://deno.land/x/rdi

```typescript
import 'https://deno.land/x/reflect_metadata@v0.1.12/mod.ts';

import {
  Bootstrap,
  Injectable,
  Module
} from 'https://cdn.esm.sh/v53/@rhtml/di@0.0.81';

@Injectable()
class MyService {
  OnInit() {
    console.log('[MyService]: initialized');
  }

  helloWorld() {
    return 'Hello World from @rhtml/di';
  }
}

@Injectable()
class MyService2 {
  constructor(private myService: MyService) {}
  OnInit() {
    console.log(this.myService.helloWorld());
  }
}

@Module({
  providers: [MyService, MyService2]
})
export class AppModule {}

await Bootstrap(AppModule);

```

#### With Reflection

```bash
npm i @abraham/reflection
```

```ts
import '@abraham/reflection';

import { Inject, Injectable } from '@rhtml/di';

class Test {
  test = 42;
}
@Injectable()
class Test2 {
  constructor(public test: Test) {}
}
const test2 = set(Test2);
console.log(test2.test.test); // 42
```

#### Token Injection

```ts
import { InjectionToken, Injectable, Inject } from '@rhtml/di';

const Token = new InjectionToken<Test>();

@Injectable()
class Test {
  myMethod() {}
}

set(Test, Token);

@Injectable()
class App {
  constructor(@Inject(Token) private test: Test) {}
}

console.log(get(App).test.myMethod());
```

#### Monadic approach

```typescript
import { Inject, PrivateReader, Reader } from '@rhtml/di';

export class UserCache {
  name = '[UserCache]: My name is ';
}

export class UserService {
  @Inject(UserCache)
  public cache: UserCache;
}

const AppModule = [UserService, UserCache];

class App {
  @Reader(...AppModule)
  getPesho(name: string): Reader<[UserService], string> {
    return ([userService]) => userService.cache.name + name;
  }

  getPeshoAsync(
    name: string
  ): PrivateReader<[UserService, UserCache], Promise<string>> {
    return async ([userService, userCache]) =>
      userService.cache.name + name + userCache.name;
  }

  @Reader(...AppModule)
  test2(name: string): Reader<[UserService, UserCache], Promise<string>> {
    return async ([userService, userCache]) => {
      return (
        userService.cache.name +
        name +
        (await this.getPeshoAsync('omg')([userService, userCache]))
      );
    };
  }
}
const app = new App();
const action = app.getPesho('Kristiyan Tachev');
const asyncAction = app.test2('Kristiyan Tachev');
console.log(action());
asyncAction().then(console.log);
```

```typescript
import { Inject, Reader, set } from '@rhtml/di';

export class UserCache {
  name = '[UserCache]: My name is ';
}

export class UserService {
  @Inject(UserCache)
  public cache: UserCache;
}

class App {
  @Reader(UserService)
  getPesho(name: string): Reader<[UserService], string> {
    return ([userService]) => userService.cache.name + name;
  }

  @Reader(UserService)
  getPeshoAsync(name: string): Reader<[UserService], Promise<string>> {
    return async ([userService]) => userService.cache.name + name;
  }
}
const app = set(App);
const action = app.getPesho('Kristiyan Tachev');
const asyncAction = app.getPeshoAsync('Kristiyan Tachev');
console.log(action());
asyncAction().then(console.log);
```

##### Using Static methods

```ts
import { Inject, Reader, set } from '@rhtml/di';

export class UserCache {
  name = '[UserCache]: My name is ';
}

export class UserService {
  @Inject(UserCache)
  public cache: UserCache;
}

const AppModule = [UserService, UserCache];

class App {
  @Reader(...AppModule)
  public static getPesho(name: string): Reader<[UserService], string> {
    return ([userService]) => userService.cache.name + name;
  }

  public static getPeshoAsync(
    name: string
  ): PrivateReader<NonNullable<[UserService, UserCache]>, Promise<string>> {
    return async ([userService, userCache]) =>
      userService.cache.name + name + userCache.name;
  }

  @Reader(...AppModule)
  public static test2(
    name: string
  ): Reader<[UserService, UserCache], Promise<string>> {
    return async ([userService, userCache]) => {
      return (
        userService.cache.name +
        name +
        (await this.getPeshoAsync('omg')([userService, userCache]))
      );
    };
  }
}
const asyncAction = App.test2('Kristiyan Tachev');
asyncAction().then(console.log);
```

##### Module decorator

```ts
import { Injectable, Inject, set, get } from '@rhtml/di';
import { Module } from '@rhtml/di/module';

class User {
  id = 1;
}
class UserService {
  @Inject(User)
  user: User;
}

@Injectable()
class InjectableService {
  constructor(@Inject(User) private user: User) {}
}

@Module({
  providers: [UserService, InjectableService]
})
class UserModule {}

@Module({
  imports: [UserModule]
})
class AppModule {}
console.log(has(AppModule)); // False
set(AppModule);
const userService = get(UserService);
expect(userService.user.id).toBe(1);
```

##### Advanced example using Lazy providers

```ts
import '@abraham/reflection';

import { Inject, Injectable, InjectionToken, remove, set } from '@rhtml/di';
import {
  Bootstrap,
  Component,
  Module,
  ModuleWithProviders
} from '@rhtml/di/module';

type Token1 = number;
type Token2 = string;

const Token1 = new InjectionToken<Token1>();
const Token2 = new InjectionToken<Token2>();

const now = Date.now();

@Injectable()
export class UserService66 {
  constructor() {
    console.log('[UserService66]');
  }

  getOmg() {
    return 'ARE BE OMG';
  }
}

@Injectable()
export class UserService {
  // @Inject(Token1) public token: number;
  constructor(@Inject(Token1) public token: number) {
    console.log('[UserService]', token);
  }
}

@Injectable()
export class UserService2 {
  constructor(public userService: UserService) {
    console.log('[UserService2]');
  }
}

@Injectable()
export class UserService3 {
  // @Inject(Token1) public token: number;
  constructor(@Inject(Token1) public token: Token1) {
    console.log('[UserService3]', token);
  }
}

@Injectable({ providers: [set(UserService66)] })
export class UserService4 {
  constructor(data: UserService66) {
    console.log('[UserService4]', data.getOmg());
  }

  getPesh() {
    return 6000;
  }
}

@Component()
class AppComponent {
  constructor(
    public userService2: UserService2,
    @Inject(Token2) public token: Token2
  ) {
    console.log('[AppComponent]', userService2.userService.token, token);
  }

  OnInit() {
    console.log('INITIALIZEEEDDDDD ');
  }

  OnDestroy() {
    console.log('ON DESTROY ');
  }
}

set(UserService4);

@Module({
  providers: [
    UserService2,
    {
      provide: Token1,
      deps: [UserService4],
      useFactory: (data: UserService4) =>
        new Promise<number>(resolve =>
          setTimeout(() => resolve(data.getPesh()), 1000)
        )
    }
  ],
  bootstrap: [AppComponent]
})
export class MainModule {
  static forRoot(): ModuleWithProviders {
    return {
      module: MainModule,
      providers: [
        {
          provide: Token2,
          useFactory: async () => {
            console.log('aa');
            return '1234';
          }
        }
      ]
    };
  }
}

Bootstrap(MainModule).then(() => {
  console.log('Started', `after ${Date.now() - now}`);
  remove(AppComponent);
});
```
