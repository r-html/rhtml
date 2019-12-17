import { GraphqlModuleConfig } from '@rxdi/graphql-client';
import { DEFAULTS } from './tokens';
export interface GraphqlSettings {
    config: GraphqlModuleConfig;
    defaults: DEFAULTS;
}
export declare let GraphqlSettings: GraphqlSettings;
export declare function setConfig(config: GraphqlSettings): GraphqlSettings;
