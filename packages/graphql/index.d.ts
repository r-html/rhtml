import { GraphComponent } from './graph.component';
export declare class GraphqlModule {
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
