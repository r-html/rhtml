import '@abraham/reflection';

import { Inject, Injectable, InjectionToken } from '../../src/index';
import { Bootstrap, Module } from '../../src/module';

type Token1 = number;
const Token1 = new InjectionToken<Token1>();
const now = Date.now();

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

@Injectable()
class AppComponent {
  constructor(public userService2: UserService2) {
    console.log('[AppComponent]', userService2.userService.token);
  }
}

@Module({
  providers: [
    UserService2,
    {
      provide: Token1,
      useFactory: () =>
        new Promise<number>(resolve => {
          setTimeout(() => {
            resolve(3000);
          }, 3000);
        })
    }
  ],
  bootstrap: [AppComponent]
})
export class MainModule {}

Bootstrap(MainModule).then(() => {
  console.log('Started', `after ${Date.now() - now}`);
});
