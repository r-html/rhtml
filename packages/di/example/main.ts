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
  ): PrivateReader<NonNullable<[UserService, UserCache]>, Promise<string>> {
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
const asyncAction = new App().test2('Kristiyan Tachev');
asyncAction().then(console.log);
