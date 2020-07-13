/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDecorator,
  defineMetaInjectors,
  get,
  getReflection,
  InjectionToken,
  Metadata,
  ObjectType,
  ObjectUnion,
  Options,
  set
} from './index';

export const Component = (options?: Options) => createDecorator(options);

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
        (entries.imports || []) as ExtendedFunction[]
      )) {
        const root = entry.forRoot && entry.forRoot();
        if (root) {
          root.providers.map(p => ProvidersMetadata.set(p, p));
          set(root.module);
        } else {
          set(entry);
        }
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
export type WithProviders<T = unknown> = ObjectUnion<T> & {
  provide: T | (string & InjectionToken<unknown>);
  deps?: (T | (string & InjectionToken<unknown>))[];
  useFactory: (...args) => Promise<unknown>;
};

export interface ModuleWithProviders<T = any> {
  module: ExtendedFunction;
  providers: WithProviders<T>[];
}

export interface ExtendedFunction extends Function {
  forRoot?: () => ModuleWithProviders;
}

export async function Bootstrap(app: ExtendedFunction) {
  const root = app.forRoot && app.forRoot();
  if (root) {
    root.providers.map(p => ProvidersMetadata.set(p, p));
    set(root.module);
  }
  set(app);
  await Promise.all(
    [...ProvidersMetadata.values()]
      .map(async value =>
        set(
          value.useFactory
            ? await value.useFactory(...(value.deps || []).map(get))
            : value,
          value.provide ? value.provide : null
        )
      )
      .reverse()
  );
  [...BootstrapsMetadata.values()].map(value => set(value));
}
