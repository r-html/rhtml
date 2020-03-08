import { ModuleWithProviders } from '@rxdi/core';
import { GraphqlModuleConfig } from '@rxdi/graphql-client';
import { DEFAULTS } from './tokens';
export declare class GraphModule {
    static forRoot(config: GraphqlModuleConfig, defaults?: DEFAULTS): ModuleWithProviders;
}
