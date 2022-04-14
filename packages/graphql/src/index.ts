import { Module } from '@rxdi/core';

import { GraphComponent } from './graph.component';
import { GraphModule } from './graph.module';
import { GraphqlSettings } from './settings';

export function setConfig(graphqlSettings: GraphqlSettings) {
  return Module({
    imports: [
      GraphModule.forRoot(graphqlSettings.config, graphqlSettings.defaults),
    ],
  })(class GraphqlModule {});
}

export * from './base.service';
export * from './graph.component';
export * from './types';
export * from './settings';

declare global {
  interface HTMLElementTagNameMap {
    'r-graph': GraphComponent;
  }
}
