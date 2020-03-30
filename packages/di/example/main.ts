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
