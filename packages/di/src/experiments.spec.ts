import { get } from './di';
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
    const called = test2.test()();
    expect(called.arg.test).toBe(42);
    expect(called.arg2.test).toBe(43);
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
