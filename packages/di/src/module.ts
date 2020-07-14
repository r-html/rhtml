/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDecorator,
  InjectionToken,
  ObjectType,
  ObjectUnion,
  Options,
  set
} from './index';

const ProvidersMetadata = new Map<ObjectUnion, WithProviders>();
const BootstrapsMetadata = new Map<ObjectUnion, ObjectUnion>();

const filterNonNull = <T>(p: T[]): T[] => p.filter(i => !!i);

const setImport = (entry: ExtendedFunction) => {
  const root = entry.forRoot && entry.forRoot();
  if (root) {
    root.providers.map(p => ProvidersMetadata.set(p, p));
    set(root.module);
  } else {
    set(entry);
  }
};

export const Component = (options?: Options) => createDecorator(options);

export const Module = <T>(
  entries: {
    imports?: T | ObjectType<T>[];
    providers?: T | WithProviders<T>[];
    components?: T | ObjectType<T>[];
    bootstrap?: ObjectUnion;
  } = {}
) =>
  createDecorator({
    before(args) {
      for (const entry of filterNonNull(
        (entries.imports || []) as ExtendedFunction[]
      )) {
        setImport(entry);
      }
      for (const entry of filterNonNull(
        (entries.providers || []) as WithProviders[]
      ).filter(e => typeof e.useFactory === 'function')) {
        ProvidersMetadata.set(entry, entry);
      }
      for (const entry of filterNonNull(
        (entries.bootstrap || []) as ObjectUnion[]
      )) {
        BootstrapsMetadata.set(entry, entry);
      }
      return args;
    }
  });

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
  setImport(app);
  await Promise.all(
    [...ProvidersMetadata.values()].map(async value =>
      set(await value.useFactory(...(value.deps || []).map(set)), value.provide)
    )
  );
  [...BootstrapsMetadata.values()].map(value => set(value));
}
