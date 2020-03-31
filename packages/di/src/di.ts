export type ObjectType<T> = new (...args: unknown[]) => T;
const C = new Map();

const ascii = (a: string) => a.charCodeAt(0);

const toHashKey = <T>(c: ObjectType<T>) =>
  `${c}`
    .split('')
    .map(ascii)
    .join('')
    .substring(0, 50);

export const get = <T>(c: ObjectType<T>): T => C.get(toHashKey(c));
export const has = <T>(c: ObjectType<T>): boolean => !!C.has(toHashKey(c));
export const set = <T>(c: ObjectType<T>, hash = toHashKey(c)): T =>
  C.has(hash) ? C.get(hash) : C.set(hash, new c()).get(hash);
export const clear = () => C.clear();
export const remove = <T>(c: ObjectType<T>) => C.delete(toHashKey(c));
