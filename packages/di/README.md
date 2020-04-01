# @rhtml/di

Smallest Dependency Injection for Typescript and Javascript!

- Only `1.3kb` bundled size without Reflection, `2.37kb` with `@abraham/reflection`;
- Code coverage 100%
- No dependencies

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
