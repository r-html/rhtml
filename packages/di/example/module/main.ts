import '@abraham/reflection';

import { Inject, Injectable, InjectionToken, set } from '../../src/index';
import {
  Bootstrap,
  Component,
  Module,
  ModuleWithProviders
} from '../../src/module';

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
          useFactory: () => {
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
});
