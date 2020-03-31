/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectType, set } from './di';

export type Reader<T, K> = (d?: T) => K;
export type PrivateReader<T, K> = (d: NonNullable<T>) => K;
type MethodDecoratorArguments = [
  Record<string, unknown>,
  string | symbol,
  TypedPropertyDescriptor<unknown>
];
export function Reader<T>(...di: ObjectType<unknown>[]): MethodDecorator {
  return (...a: MethodDecoratorArguments) => {
    const o = a[2].value as Function;
    a[2].value = function(...args: unknown[]) {
      return () => o.apply(this, args)(di.map(p => set(p)));
    };
  };
}

export function DI<T>(...di: ObjectType<T>[]): MethodDecorator {
  return (...a: MethodDecoratorArguments) => {
    const m = a[2].value as Function;
    a[2].value = function() {
      return m.apply(
        this,
        di.map(p => set(p))
      );
    };
  };
}

export function Inject<T>(clazz: ObjectType<T>): PropertyDecorator {
  return (target, name: string) =>
    Object.defineProperty(target, name, {
      get: () => set(clazz)
    });
}

export interface ModuleWithProviders<T = {}> {
  providers?: ObjectType<T>[];
  imports?: ObjectType<T>[];
}

type Constructor<T = {}> = new (...args: any[]) => T;

const setProviders = <T>(i: ObjectType<T>[]) => (i || []).map(p => set(p));

export const Module = <T>(o?: ModuleWithProviders<T>) => <
  TBase extends Constructor
>(
  Base: TBase
) =>
  class extends Base {
    constructor(...args: any[]) {
      setProviders(o.imports);
      setProviders(o.providers);
      super(args);
    }
  };
