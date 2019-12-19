import { LensComponent } from './lens';
import { FetchComponent } from './fetch';
import { MonadComponent } from './part-monad';
import { RenderComponent } from './render';
import { Renderer } from './renderer';
import { StateComponent } from './state';
import { SettingsComponent } from './settings';
export * from './lens';
export * from './render';
export * from './part-monad';
export * from './renderer';
export * from './settings';
export * from './state';
declare global {
    interface HTMLElementTagNameMap {
        'r-lens': LensComponent;
        'r-fetch': FetchComponent;
        'r-part': MonadComponent;
        'r-render': RenderComponent;
        'r-renderer': Renderer;
        'r-settings': SettingsComponent;
        'r-state': StateComponent;
    }
}
