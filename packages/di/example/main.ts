import { Inject, set } from '../src/index';

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
const pav4e = set(App);
console.log(pav4e);
