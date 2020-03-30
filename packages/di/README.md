# @rhtml/di

Smallest Dependency Injection for Typescript and Javascript! Only `2.8kb`

#### Installation

```bash
npm i @rhtml/di
```

#### Usage

```typescript
import { Inject, set } from '@rhtml/di';

export class UserCache {
  pesho = '[UserCache]: pesho';
}

export class UserService {
  @Inject(UserCache)
  public cache: UserCache;
}

class App {
  @Inject(UserService)
  private userService: UserService;

  getPesho() {
    return this.userService.cache.pesho;
  }
}
const app = set(App);
console.log(app.getPesho());
```

#### Monad Reader

```typescript
import { Inject, set } from '@rhtml/di';

export class UserCache {
  pesho = '[UserCache]: pesho';
}

export class UserService {
  @Inject(UserCache)
  public cache: UserCache;
}

class App {
  @Reader(UserService)
  getPesho(): Reader<[UserService], { arg: Test; arg2: Test2 }> {
    return ([userService]) => userService.cache.pesho;
  }
}
const app = set(App);
console.log(app.getPesho());
```
