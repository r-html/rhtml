/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDecorator,
  InjectionToken,
  ObjectType,
  ObjectUnion,
  Options,
  set,
} from '../index';

const ProvidersMetadata = new Map<ObjectUnion, WithProviders>();
const BootstrapsMetadata = new Map<ObjectUnion, ObjectUnion>();

const filterNonNull = <T>(p: T[]): T[] => p.filter((i) => !!i);

const setImport = (entry: ModuleWithProviders) => {
  if (entry.module) {
    entry.providers.map((p) => ProvidersMetadata.set(p, p));
    set(entry.module);
  } else {
    set(entry);
  }
};

export const Component = (options?: Options) => createDecorator(options);

export const Module = <T>(
  entries: {
    imports?: T | ObjectType<unknown>[];
    providers?: T | WithProviders<unknown>[] | ObjectUnion[];
    components?: T | ObjectType<unknown>[];
    bootstrap?: ObjectUnion[];
  } = {}
) =>
  createDecorator({
    before(args) {
      for (const entry of filterNonNull(
        ((entries.imports as unknown) || []) as ModuleWithProviders[]
      )) {
        setImport(entry);
      }

      const providers = (entries.providers || []) as WithProviders[];

      for (const entry of providers) {
        if (entry.useFactory) {
          ProvidersMetadata.set(entry, entry);
        }
      }

      for (const entry of filterNonNull(
        (entries.bootstrap || []) as ObjectUnion[]
      )) {
        BootstrapsMetadata.set(entry, entry);
      }

      return args;
    },
  });

export type WithProviders<T = unknown> = ObjectUnion<T> & {
  provide: T | (string & InjectionToken<unknown>);
  deps?: (T | (string & InjectionToken<unknown>))[];
  useFactory: (...args) => any;
};

export interface ModuleWithProviders<T = any> {
  module: ExtendedFunction<T>;
  providers: WithProviders<T>[];
}

export interface ExtendedFunction<T> {
  forRoot?: (...args: any[]) => ModuleWithProviders<T>;
}

export async function Bootstrap<T>(app: T) {
  setImport(app as unknown as ModuleWithProviders);
  await Promise.all(
    [...ProvidersMetadata.values()].map(async (value) =>
      set(await value.useFactory(...(value.deps || []).map(set)), value.provide)
    )
  );
  [...BootstrapsMetadata.values()].map((value) => set(value));
}
