import { get, Inject } from './di';
import { DI, Reader } from './experiments';

describe('[Experiments]: test', () => {
  it('Experimental', async () => {
    class Test {
      test = 42;
    }
    class Test2 {
      @DI(Test, Test)
      test(test?: Test) {
        return test;
      }
    }
    const test2 = new Test2();
    expect(test2).toBeTruthy();
    expect(test2.test().test).toBe(get(Test).test);
  });

  it('Should try to inject property inside simple function argument', async () => {
    class Test {
      test = 42;
    }
    class Test2 {
      test = 43;
    }
    class Omg {
      @DI(Test, Test2)
      test(arg?: Test, arg2?: Test2) {
        return { arg, arg2 };
      }
    }
    const test2 = new Omg();
    expect(test2).toBeTruthy();
    expect(test2.test().arg.test).toBe(42);
    expect(test2.test().arg2.test).toBe(43);
  });

  it('Should try to inject property inside simple function argument', async () => {
    class Test {
      test = 42;
    }
    class Test2 {
      test = 43;
    }
    class Omg {
      @Reader(Test, Test2)
      test(): Reader<[Test, Test2], { arg: Test; arg2: Test2 }> {
        return ([arg, arg2]) => ({ arg, arg2 });
      }
    }
    const test2 = new Omg();
    expect(test2).toBeTruthy();
    const called = test2.test();
    expect(called().arg.test).toBe(42);
    expect(called().arg2.test).toBe(43);
  });

  it('Should try to inject property and expect type string', async () => {
    class UserCache {
      string = '[UserCache]:';
    }

    class UserService {
      @Inject(UserCache)
      public cache: UserCache;
    }

    class App {
      @Reader(UserService)
      getPesho(name: string): Reader<[UserService], string> {
        return ([userService]) => userService.cache.string + name;
      }
    }
    const app = new App();
    expect(app).toBeTruthy();
    const called = app.getPesho('pesho')();
    expect(called).toBe('[UserCache]:pesho');
  });

  it('Should try to inject 3 arguments and expect type string', async () => {
    class UserCache {
      string = '[UserCache]:';
    }

    class UserService {
      @Inject(UserCache)
      public cache: UserCache;
    }

    class App {
      @Reader(UserService)
      getPesho(
        name: string,
        myName: string,
        myName2: string
      ): Reader<[UserService], string> {
        return ([userService]) =>
          userService.cache.string + name + myName + myName2;
      }
    }
    const app = new App();
    expect(app).toBeTruthy();
    const called = app.getPesho('pesho', 'myName', 'myName2');
    expect(called()).toBe('[UserCache]:peshomyNamemyName2');
  });

  it('Should get same instance everytime ', async () => {
    class UserCache {
      string = '[UserCache]:';
      constructor() {
        console.log('dadada');
      }
    }

    class App {
      @Reader(UserCache)
      getPesho(
        name: string,
        myName: string,
        myName2: string
      ): Reader<[UserCache], string> {
        return ([userService]) => userService.string + name + myName + myName2;
      }

      @Reader(UserCache)
      getGosho(): Reader<[UserCache], string> {
        return ([userService]) => {
          userService.string = 'dadadada';
          return userService.string;
        };
      }
    }
    const app = new App();
    expect(app).toBeTruthy();
    const caller = app.getGosho();
    expect(caller()).toBe('dadadada');
    const caller2 = app.getPesho('1', '2', '3');
    expect(caller2()).toBe('dadadada123');
  });
  //   it.skip('[Missing Feature]: Should try to inject property inside constructor', async () => {
  //     class Test {
  //       test = 42;
  //     }
  //     class Test2 {
  //       constructor(@Reader(Test) public test: Test) {}
  //     }
  //     const test2 = set(Test2);
  //     expect(test2).toBeTruthy();
  //     expect(test2.test).toBeTruthy();
  //   });
});
