import { Inject, PrivateReader, Reader } from '../src/index';

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
