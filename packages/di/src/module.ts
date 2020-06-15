/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defineMetaInjectors,
  getReflection,
  InjectionToken,
  Metadata,
  ObjectType,
  ObjectUnion,
  set
} from './index';

type WithProviders<T = unknown> = ObjectUnion<T> & {
  provide: T | (string & InjectionToken<unknown>);
  useFactory: () => Promise<unknown>;
};

const ProvidersMetadata = new Map<ObjectUnion, WithProviders>();
const BootstrapsMetadata = new Map<ObjectUnion, ObjectUnion>();

const filterNonNull = <T>(p: T[]): T[] => p.filter(i => !!i);

export const Module = <T>(
  entries: {
    imports?: T | ObjectType<T>[];
    providers?: T | WithProviders<T>[];
    components?: T | ObjectType<T>[];
    services?: T | ObjectType<T>[];
    bootstrap?: ObjectUnion;
  } = {}
) => <TBase extends ObjectType>(Base: TBase) =>
  class extends Base {
    constructor(...args: any[]) {
      for (const entry of filterNonNull(
        (entries.imports || []) as ObjectUnion[]
      )) {
        set(entry);
      }
      for (const entry of filterNonNull(
        (entries.providers || []) as WithProviders[]
      )) {
        if (typeof entry.useFactory === 'function') {
          ProvidersMetadata.set(entry, entry);
        }
      }
      for (const entry of filterNonNull(
        (entries.bootstrap || []) as ObjectUnion[]
      )) {
        BootstrapsMetadata.set(entry, entry);
      }
      if (!args.length) {
        defineMetaInjectors(args, getReflection(Base));
        defineMetaInjectors(args, Metadata.get(Base));
      }
      super(...args);
    }
  };

export async function Bootstrap(app: Function) {
  set(app);
  await Promise.all(
    [...ProvidersMetadata.values()].map(async value =>
      set(await value.useFactory(), value.provide)
    )
  );
  [...BootstrapsMetadata.values()].map(value => set(value));
}
