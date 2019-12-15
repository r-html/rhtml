import { LitElement, Component, property } from '@rxdi/lit-html';

/**
 * @customElement rx-state
 */
@Component({
  selector: 'rx-state'
})
export class StateComponent extends LitElement {
  @property() value: any;
}
