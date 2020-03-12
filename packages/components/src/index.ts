import '@rhtml/renderer';

import { FetchComponent } from './fetch';
import { LensComponent } from './lens';
import { MonadComponent } from './part-monad';
import { RenderComponent } from './render';
import { SettingsComponent } from './settings';
import { StateComponent } from './state';

// export * from './types';
export * from './lens';
export * from './render';
export * from './part-monad';
export * from './settings';
export * from './state';
// export * from './tokens';

declare global {
  interface HTMLElementTagNameMap {
    'r-lens': LensComponent;
    'r-fetch': FetchComponent;
    'r-part': MonadComponent;
    'r-render': RenderComponent;
    'r-settings': SettingsComponent;
    'r-state': StateComponent;
  }
}
