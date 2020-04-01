/* eslint-disable @typescript-eslint/no-explicit-any */

export type ObjectType<T = {}> = new (...args: any[]) => T;
export type PrivateReader<T, K> = (d: NonNullable<T>) => K;
export type MethodDecoratorArguments = [
  Record<string, unknown>,
  string | symbol,
  TypedPropertyDescriptor<unknown>
];
export type ObjectUnion<T = {}> = T | ObjectType<T> | InjectionToken<T>;

export interface ModuleWithProviders<T = {}> {
  providers?: ObjectType<T>[];
  imports?: ObjectType<T>[];
}
export class InjectionToken<T> {}

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

export function remove<T>(c: T | ObjectType<T>): boolean;
export function remove<T>(c: ObjectType<T>) {
  return C.delete(c);
}
export const clear = () => (C = new WeakMap());

export type Reader<T, K> = (d?: T) => K;
export function Reader<T>(...di: ObjectType<unknown>[]): MethodDecorator {
  return (...[, , desc]: MethodDecoratorArguments) => {
    const o = desc.value as Function;
    desc.value = function(...args: unknown[]) {
      return () => o.apply(this, args)(di.map(p => set(p)));
    };
  };
}

export function DI<T>(...di: ObjectType<T>[]): MethodDecorator {
  return (...[, , desc]: MethodDecoratorArguments) => {
    const m = desc.value as Function;
    desc.value = function() {
      return m.apply(
        this,
        di.map(p => set(p))
      );
    };
  };
}

function setDeps(deps: ObjectType[] = []) {
  for (const dep of deps) {
    set(dep);
  }
}

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

const meta = new WeakMap<Record<string, any>, Array<[number, ObjectUnion]>>();

function defineGetter(
  target: Record<string, any>,
  name: string | number,
  identifier: ObjectUnion
) {
  Object.defineProperty(target, name, {
    get: () => set(identifier)
  });
}

export function Inject<T>(identifier: ObjectUnion<T>): any;
export function Inject<T>(identifier: ObjectUnion<T>): PropertyDecorator;
export function Inject<T>(identifier: ObjectType<T>): PropertyDecorator {
  return (
    target,
    name: string,
    index?: number,
    params = meta.get(target) || []
  ) => {
    if (name) {
      defineGetter(target, name, identifier);
    } else {
      params.push([index, identifier]);
      meta.set(target, params);
    }
  };
}

export const Injectable = () => <K extends new (...args: any[]) => {}>(
  Base: K,
  params = meta.get(Base) || []
) =>
  class extends Base {
    constructor(...args: any[]) {
      for (const [index, identifier] of params) {
        defineGetter(args, index, identifier);
      }
      super(...args);
    }
  };
