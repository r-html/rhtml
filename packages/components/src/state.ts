import { Component, LitElement, property } from '@rxdi/lit-html';

/**
 * @customElement r-state
 */
@Component({
  selector: 'r-state',
})
export class StateComponent extends LitElement {
  @property() value;
}
