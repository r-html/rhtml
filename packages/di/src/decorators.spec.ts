import {
  clear,
  DI,
  get,
  has,
  Inject,
  Injectable,
  InjectionToken,
  Module,
  Reader,
  set
} from './index';

describe('[Experiments]: test', () => {
  afterEach(() => clear());

  it('Should inject Test1 inside Test2 service', async () => {
    class Test1 {
      test1 = 40;
    }
    class Test2 {
      @Inject(Test1) test: Test1;
      myProperty = 42;
    }
    expect(new Test2().test.test1).toBe(40);
    const test2 = set(Test2);
    expect(test2.myProperty).toBe(42);
    expect(test2.test.test1).toBe(40);
    expect(get(Test2)).toBeTruthy();
  });

  it('DI', async () => {
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
    }

    class App {
      @Reader(UserCache)
      getPesho(
        name: string,
        myName: string,
        myName2: string
      ): Reader<[UserCache], Promise<string>> {
        return async ([userCache]) =>
          userCache.string + name + myName + myName2;
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
    expect(await caller2()).toBe('dadadada123');
  });

  it('Should check if @Module decorator is working', async () => {
    class User {
      id = 1;
    }
    class UserService {
      @Inject(User)
      user: User;
    }

    @Module()
    class ModuleWithoutArguments {}

    @Module({
      providers: [UserService]
    })
    class UserModule {}

    @Module({
      imports: [UserModule, ModuleWithoutArguments]
    })
    class AppModule {}

    expect(has(AppModule)).toBeFalsy();
    expect(set(AppModule)).toBeTruthy();
    const userService = get(UserService);
    expect(userService).toBeTruthy();
    expect(has(User)).toBeFalsy();
    expect(userService.user.id).toBe(1);
  });
  it('Should try to inject property inside constructor', async () => {
    class Test {
      test = 42;
    }
    @Injectable()
    class Test2 {
      constructor(@Inject(Test) public test: Test) {}
    }
    const test2 = set(Test2);
    expect(test2).toBeTruthy();
    expect(test2.test).toBeTruthy();
    expect(test2.test.test).toBe(42);
  });

  it('Should try to inject 4 params and token inside constructor', async () => {
    @Injectable()
    class Test {
      test = 1;
    }
    @Injectable()
    class Test2 {
      test = 2;
    }
    @Injectable()
    class Test3 {
      test = 3;
    }
    @Injectable()
    class Test4 {
      test = 4;
    }
    @Injectable()
    class Test5 {
      test = 5;
    }
    const token = new InjectionToken<Test5>();
    set(Test5, token);
    @Injectable()
    class App {
      constructor(
        @Inject(Test) public test: Test,
        @Inject(Test2) public test2: Test2,
        @Inject(Test3) public test3: Test3,
        @Inject(Test4) public test4: Test4,
        @Inject(token) public test5: Test5
      ) {}
    }
    const app = set(App);
    expect(app).toBeTruthy();
    expect(app.test).toBeTruthy();
    expect(app.test.test).toBe(1);
    expect(app.test2.test).toBe(2);
    expect(app.test3.test).toBe(3);
    expect(app.test4.test).toBe(4);
    expect(has(Test5)).toBeFalsy();
    expect(app.test5.test).toBe(5);
  });
});
