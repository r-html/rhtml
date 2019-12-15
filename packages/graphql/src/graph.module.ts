import { Module, ModuleWithProviders } from '@rxdi/core';
import { GraphqlModule, GraphqlModuleConfig } from '@rxdi/graphql-client';
import { GraphComponent } from './graph.component';
import { DEFAULTS } from './tokens';

@Module()
export class GraphModule {
  public static forRoot(
    config: GraphqlModuleConfig,
    defaults: DEFAULTS = {} as DEFAULTS
  ): ModuleWithProviders {
    return {
      module: GraphModule,
      components: [GraphComponent],
      providers: [{ provide: DEFAULTS, useValue: defaults }],
      frameworkImports: [GraphqlModule.forRoot(config)]
    };
  }
}
