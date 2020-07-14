import {
  clear,
  createDecorator,
  Inject,
  Injectable,
  InjectionToken,
  remove,
  set
} from './index';
import { Bootstrap, Component, Module, ModuleWithProviders } from './module';

describe('[Module]: tests', () => {
  afterEach(() => clear());

  it('Should trigger OnInit hook', async () => {
    @Injectable()
    class Test1 {
      myProperty = 42;

      OnInit() {
        expect(true).toBeTruthy();
      }
    }
    const test1 = set(Test1);
    expect(test1.myProperty).toBe(42);
  });

  it('Should trigger OnDestroy hook', async () => {
    @Injectable()
    class Test1 {
      myProperty = 42;

      OnDestroy() {
        expect(true).toBeTruthy();
      }
    }

    const test1 = set(Test1);
    expect(test1.myProperty).toBe(42);
    remove(Test1);
  });

  it('Should create custom decorator MyDecorator', async () => {
    const MyDecorator = () => createDecorator();
    @MyDecorator()
    class Test1 {
      myProperty = 42;
    }
    const test1 = set(Test1);
    expect(test1.myProperty).toBe(42);
  });

  it('Should create custom decorator MyDecorator and try to use after hook', async () => {
    const MyDecorator = () =>
      createDecorator({
        after: () => [1]
      });

    @MyDecorator()
    class Test1 {
      constructor(public one: number) {}
    }
    const test1 = set(Test1);
    expect(test1.one).toBe(1);
  });

  it('Should pass custom providers', async () => {
    @Injectable()
    class MyProvider {
      omg = 24;
    }
    @Injectable({ providers: [set(MyProvider)] })
    class Test1 {
      myProperty = 42;
      constructor(public myProvider: MyProvider) {}
    }
    const test1 = set(Test1);
    expect(test1.myProperty).toBe(42);
    expect(test1.myProvider.omg).toBe(24);
  });

  it('Should pass custom providers', async () => {
    @Injectable()
    class MyProvider {
      omg = 24;
    }
    @Injectable({ providers: [set(MyProvider)] })
    class Test1 {
      myProperty = 42;
      constructor(public myProvider: MyProvider) {}
    }
    type Token1 = string;
    const Token1 = new InjectionToken<Token1>();
    type Token2 = string;
    const Token2 = new InjectionToken<Token2>();
    @Component()
    class AppComponent {
      constructor(
        @Inject(Token1) public token: Token1,
        @Inject(Token2) public token2: Token2
      ) {}

      OnInit() {
        expect(this.token).toBe(42);
        expect(this.token2).toBe('1234');
      }

      OnDestroy() {
        expect(this.token).toBe(42);
        expect(this.token2).toBe('1234');
      }
    }
    @Injectable()
    class Omg {}
    @Module({
      providers: [
        Omg,
        {
          provide: Token1,
          deps: [Test1],
          useFactory: (data: Test1) =>
            new Promise<number>(resolve =>
              setTimeout(() => resolve(data.myProperty), 1000)
            )
        }
      ],
      bootstrap: [AppComponent]
    })
    class MainModule {
      static forRoot(): ModuleWithProviders {
        return {
          module: MainModule,
          providers: [
            {
              provide: Token2,
              useFactory: () => '1234'
            }
          ]
        };
      }
    }

    await Bootstrap(MainModule);
    remove(AppComponent);
  });
});
