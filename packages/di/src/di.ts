export type ObjectType<T> = new (...args: unknown[]) => T;

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
