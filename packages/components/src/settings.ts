import { LitElement, Component, property } from '@rxdi/lit-html';
import { Settings } from './types';

/**
 * @customElement rx-settings
 */
@Component({
  selector: 'rx-settings'
})
export class SettingsComponent extends LitElement {
  @property({ type: Object }) value: Settings;
}
