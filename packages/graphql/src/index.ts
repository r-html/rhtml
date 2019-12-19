import { Module } from '@rxdi/core';
import { GraphModule } from './graph.module';
import { GraphqlSettings } from './settings';
import { GraphComponent } from './graph.component';

@Module({
  imports: [
    GraphModule.forRoot(GraphqlSettings.config, GraphqlSettings.defaults)
  ]
})
export class GraphqlModule {}

export * from './base.service';
export * from './graph.component';
export * from './types';
export * from './settings';

declare global {
  interface HTMLElementTagNameMap {
    'r-graph': GraphComponent;
  }
}
