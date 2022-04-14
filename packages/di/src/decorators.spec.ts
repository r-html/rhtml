import '@abraham/reflection';

import {
  clear,
  get,
  has,
  Inject,
  Injectable,
  InjectionToken,
  Reader,
  remove,
  set,
} from './index';
import { Module } from './module/module';
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
      imports: [UserService],
    })
    class UserModule {}

    @Module({
      imports: [UserModule, ModuleWithoutArguments],
    })
    class AppModule {}

    expect(has(AppModule)).toBeFalsy();
    expect(set(AppModule)).toBeTruthy();
    const userService = get(UserService);
    expect(userService).toBeTruthy();
    expect(has(User)).toBeFalsy();
    expect(userService.user.id).toBe(1);
    expect(has(User)).toBeTruthy();
  });

  it('Should check if @Module decorator is working with di', async () => {
    class User {
      id = 1;
    }
    @Module()
    class UserModule {
      constructor(public user: User) {}
    }

    @Module()
    class UserModule2 {
      constructor(@Inject(User) public user: User) {}
    }
    expect(set(UserModule).user.id).toBe(1);
    expect(set(UserModule2).user.id).toBe(1);
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
    class Test {
      test = 1;
    }
    class Test2 {
      test = 2;
    }
    class Test3 {
      test = 3;
    }
    class Test4 {
      test = 4;
    }
    @Injectable()
    class Test5 {
      test = 5;
      constructor(@Inject(Test4) public omg: Test4) {}
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
    expect(app.test5.omg.test).toBe(4);
  });

  it('Should try to inject class without @Inject decorator', async () => {
    class Test5 {
      test = 5;
    }
    @Injectable()
    class App {
      constructor(public test: Test5) {}
    }

    expect(has(Test5)).toBeFalsy();
    const app = set(App);
    expect(has(Test5)).toBeTruthy();

    expect(app.test.test).toBe(5);
  });

  it('Should inject custom class without @Inject', async () => {
    class Test {
      test = 5;
    }
    class Test6 {
      test = 55;
    }
    class Test7 {
      test = 42;
    }
    @Injectable()
    class App {
      constructor(@Inject(Test) public test: Test, public test6: Test6) {}
    }
    const app = new App(new Test6(), set(Test7));
    expect(app.test.test).toBe(55);
    expect(app.test6.test).toBe(42);

    const appInjection = set(App);
    expect(appInjection.test.test).toBe(5);
    expect(appInjection.test6.test).toBe(55);
  });

  it('Should inject different token when another is provided', async () => {
    class Test {
      test = 42;
    }
    class Test2 {
      test = 420;
    }
    @Injectable()
    class App {
      constructor(public test: Test) {}
    }
    let appInjection = set(App);
    expect(appInjection.test.test).toBe(42);
    remove(Test);
    remove(App);
    set(Test2, Test);
    appInjection = set(App);
    expect(appInjection.test.test).toBe(420);
  });

  it('Should extend class with @Injectable()', async () => {
    class Test {
      test = 42;
    }

    class Test2 {
      test = 420;
    }

    @Injectable()
    class App extends Test {
      constructor(@Inject(Test2) public test2: Test2) {
        super();
      }
    }

    class App2 extends App {}
    const appInjection = set(App2);
    expect(appInjection.test).toBe(42);
    expect(appInjection.test2.test).toBe(420);
  });
});
