import { Module } from '@rxdi/core';
import { GraphModule } from './graph.module';
import { GraphqlSettings } from './settings';

@Module({
    imports: [
        GraphModule.forRoot(
            GraphqlSettings.config,
            GraphqlSettings.defaults
        )
    ]
})
export class GraphqlModule { }



export * from './base.service';
export * from './graph.component';
export * from './types';
