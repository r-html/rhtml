import { clear, get, has, remove, set } from './di';

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

  it('Should check if we can remove single dependency', async () => {
    class Test2 {
      myProperty = 42;
    }
    expect(has(Test2)).toBeFalsy();
    expect(set(Test2)).toBeTruthy();
    expect(has(Test2)).toBeTruthy();
    expect(remove(Test2)).toBeTruthy();
    expect(has(Test2)).toBeFalsy();
  });
});
