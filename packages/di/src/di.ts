export type ObjectType<T> = new (...args: unknown[]) => T;
export type StringOrObject<T> = ObjectType<T> | string;

const C = new Map();
const safeHandle = <T>(c: ObjectType<T>) =>
  c.prototype && c.prototype.constructor ? new c() : c;
export function get<T>(c: StringOrObject<T>): T;
export function get<T>(c: ObjectType<T>): T {
  return C.get(c);
}
export function has<T>(c: StringOrObject<T>): T;
export function has<T>(c: ObjectType<T>): boolean {
  return !!C.has(c);
}
export function set<T>(c: StringOrObject<T>, k?: string): T;
export function set<T>(c: ObjectType<T>, k?: StringOrObject<T>): T {
  return C.has(c) ? C.get(c) : C.set(k ? k : c, safeHandle(c)).get(c);
}

export function remove<T>(c: StringOrObject<T>): T;
export function remove<T>(c: ObjectType<T>) {
  return C.delete(c);
}
export const clear = () => C.clear();
