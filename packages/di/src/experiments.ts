import { ObjectType, set } from './di';

export type Reader<T, K> = (d?: T) => K;
export type PrivateReader<T, K> = (d: NonNullable<T>) => K;

export function Reader<T>(...di: ObjectType<unknown>[]): MethodDecorator {
  return (
    ...a: [
      Record<string, unknown>,
      string | symbol,
      TypedPropertyDescriptor<unknown>
    ]
  ) => {
    const o = a[2].value as Function;
    a[2].value = function(...args: unknown[]) {
      return () => o.apply(this, args)(di.map(p => set(p)));
    };
  };
}

export function DI<T>(...di: ObjectType<T>[]): MethodDecorator {
  return (
    ...a: [
      Record<string, unknown>,
      string | symbol,
      TypedPropertyDescriptor<unknown>
    ]
  ) => {
    const m = a[2].value as Function;
    a[2].value = function() {
      return m.apply(
        this,
        di.map(p => set(p))
      );
    };
  };
}
