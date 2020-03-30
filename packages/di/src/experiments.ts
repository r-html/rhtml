import { ObjectType, set } from './di';

export type Reader<T, K> = (d?: T) => K;

export function Reader<T>(...di: ObjectType<T>[]): MethodDecorator {
  return (
    ...a: [
      Record<string, unknown>,
      string | symbol,
      TypedPropertyDescriptor<unknown>
    ]
  ) => {
    const o = a[2].value as Function;
    a[2].value = (...args: unknown[]) => () =>
      o.apply(this, args)(di.map(p => set(p)));
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
    a[2].value = () =>
      m.apply(
        this,
        di.map(p => set(p))
      );
  };
}
