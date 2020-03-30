import { clear, get, has, Inject, set } from './index';

describe('[DI]: tests', () => {
  afterEach(() => clear());

  it('Should set class to container and resolve it', async () => {
    class Test1 {
      myProperty = 42;
    }

    const test1 = set(Test1);
    expect(test1.myProperty).toBe(42);
  });
  it('Should return undefined if container is not registered', async () => {
    class Test1 {
      myProperty = 42;
    }
    expect(get(Test1)).toBeFalsy();
  });

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

  it('Should check if Test2 is registered', async () => {
    class Test2 {
      myProperty = 42;
    }
    expect(has(Test2)).toBeFalsy();
    set(Test2);
    expect(has(Test2)).toBeTruthy();
    expect(get(Test2).myProperty).toBe(42);
  });

  it('Should check if Test2 is cleaned after clear() method', async () => {
    class Test2 {
      myProperty = 42;
    }
    expect(has(Test2)).toBeFalsy();
    set(Test2);
    expect(has(Test2)).toBeTruthy();
    expect(get(Test2).myProperty).toBe(42);
    clear();
    expect(has(Test2)).toBeFalsy();
    expect(get(Test2)).toBeFalsy();
  });
});
