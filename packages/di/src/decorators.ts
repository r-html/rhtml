/* eslint-disable @typescript-eslint/no-explicit-any */
import '@abraham/reflection';

import { ObjectType, ObjectUnion, set } from './di';

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

const ReflectionParam = Symbol();
type ReflectionParam<T> = [number, ObjectUnion<T>];

export function Inject<T>(identifier: ObjectUnion<T>): any;
export function Inject<T>(identifier: ObjectUnion<T>): PropertyDecorator;
export function Inject<T>(identifier: ObjectType<T>): PropertyDecorator {
  return (
    target,
    name: string,
    index?: number,
    params: ReflectionParam<T>[] = Reflect.getOwnMetadata(
      ReflectionParam,
      target,
      name
    ) || []
  ) => {
    params.push([index, identifier]);
    Reflect.defineMetadata(ReflectionParam, params, target, name);
    Object.defineProperty(target, name, {
      get: () => set(identifier)
    });
  };
}

export const Injectable = <T>(token?: ObjectUnion<T>): any => <
  K extends new (...args: any[]) => {}
>(
  Base: K,
  params: ReflectionParam<T>[] = Reflect.getOwnMetadata(
    ReflectionParam,
    Base
  ) || []
) => {
  set(Base, token);
  return class extends Base {
    constructor(...args: any[]) {
      for (const [index, identifier] of params) {
        args[index] = set(identifier);
      }
      super(...args);
    }
  };
};

export interface ModuleWithProviders<T = {}> {
  providers?: ObjectType<T>[];
  imports?: ObjectType<T>[];
}

type Constructor<T = {}> = new (...args: any[]) => T;

const setDeps = <T>(i: ObjectType<T>[]) => (i || []).map(p => set(p));

export const Module = <T>(o: ModuleWithProviders<T> = {}) => <
  TBase extends Constructor
>(
  Base: TBase
) =>
  class extends Base {
    constructor(...args: any[]) {
      setDeps(o.imports);
      setDeps(o.providers);
      super(...args);
    }
  };
