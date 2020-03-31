/* eslint-disable @typescript-eslint/no-explicit-any */
import '@abraham/reflection';
export type ObjectType<T = {}> = new (...args: any[]) => T;
export class InjectionToken<T> {}

export type ObjectUnion<T> = T | ObjectType<T> | InjectionToken<T>;

let C = new WeakMap();

const safeHandle = <T>(c: ObjectType<T>) =>
  c.prototype && c.prototype.constructor ? new c() : c;

export function get<T>(c: ObjectUnion<T>): T;
export function get<T>(c: ObjectType<T>): T {
  return C.get(c);
}
export function has<T>(c: ObjectUnion<T>): boolean;
export function has<T>(c: ObjectType<T>): boolean {
  return !!C.has(c);
}
export function set<T>(c: T | ObjectType<T>, k?: ObjectUnion<T>): T;
export function set<T>(c: ObjectType<T>, k?: ObjectUnion<T>): T {
  return C.has(c) ? C.get(c) : C.set(k ? k : c, safeHandle(c)).get(k ? k : c);
}

export const remove = <T>(c: ObjectType<T>) => C.delete(c);
export const clear = () => (C = new WeakMap());

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

export interface ModuleWithProviders<T = {}> {
  providers?: ObjectType<T>[];
  imports?: ObjectType<T>[];
}

const setDeps = <T>(i: ObjectType<T>[]) => (i || []).map(p => set(p));

export const Module = <T>(o: ModuleWithProviders<T> = {}) => <
  TBase extends ObjectType
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
