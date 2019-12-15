import { LitElement, Component, property } from '@rxdi/lit-html';
import { Settings } from './types';

/**
 * @customElement r-settings
 */
@Component({
  selector: 'r-settings'
})
export class SettingsComponent extends LitElement {
  @property({ type: Object }) value: Settings;
}
