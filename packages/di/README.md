# @rhtml/di

Smallest Dependency Injection for Typescript and Javascript! Only `2.4kb`

#### Installation

```bash
npm i @rhtml/di
```

#### Usage

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
      console.log(this);
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

#### Monad Reader

```typescript
import { Inject, Reader, set } from '../src/index';

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
class User {
  id = 1;
}
class UserService {
  @Inject(User) user: User;
}

@Module({
  providers: [UserService]
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
