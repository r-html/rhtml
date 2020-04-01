import {
  clear,
  get,
  has,
  Inject,
  Injectable,
  InjectionToken,
  remove,
  set
} from './index';

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

  it('Should set InjectionToken and get id from it', async () => {
    class User {
      id = 1;
    }
    const token = new InjectionToken<User>();
    expect(has(User)).toBeFalsy();
    expect(get(token)).toBeFalsy();
    set(User, token);
    expect(has(token)).toBeTruthy();
    expect(has(User)).toBeFalsy();
    expect(get(token)).toBeTruthy();
    expect(get(token).id).toBe(1);
  });

  it('Should set unique object token', async () => {
    const User = { id: 1 };
    const token = { value: 'omg' };
    expect(has(token)).toBeFalsy();
    set(User, token);
    expect(has(token)).toBeTruthy();
    expect(has(User)).toBeFalsy();
    expect(get(token)).toBeTruthy();
    expect(get<typeof User>(token).id).toBe(1);
  });

  it('Should try to Inject service from token', async () => {
    class User {
      id = 1;
    }
    const token = new InjectionToken<User>();
    class User2 {
      @Inject(token)
      user: User;
    }
    set(User, token);
    expect(has(User2)).toBeFalsy();
    set(User2);
    expect(get(User2).user.id).toBe(1);
  });

  it('Should fail if injectable decorator is missing and we try to get it', async () => {
    class User {}
    expect(has(User)).toBeFalsy();
  });

  it('Should have User registered inside dependencies', async () => {
    @Injectable()
    class User {}
    set(User);
    expect(has(User)).toBeTruthy();
  });

  it('Should try create class Injectable with token', async () => {
    interface User {
      id: number;
    }
    const token = new InjectionToken<User>();
    @Injectable()
    class User2 {
      id = 1;
    }
    expect(has(token)).toBeFalsy();
    const x = set(User2, token);
    x.id = 2;
    expect(set(User2).id).toBe(1);
    expect(get(token).id).toBe(2);
  });

  it('Should try create class Injectable', async () => {
    @Injectable()
    class User2 {
      id = 1;
    }
    expect(has(User2)).toBeFalsy();
    set(User2);
    expect(get(User2).id).toBe(1);
  });
});
