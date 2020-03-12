import { Component, html, LitElement, property } from '@rxdi/lit-html';

import { LetOperator } from './let';
/**
 * @customElement r-for
 */
@Component({
  selector: 'r-for',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class ForOperator extends LitElement {
  @property({ type: Array })
  public of = [];
  OnUpdate() {
    const slotNodes = this.shadowRoot.querySelector('slot').assignedNodes();
    if (slotNodes.length) {
      const slotNode = slotNodes[0];
      const letOperator = slotNode.nextSibling as LetOperator;
      if (letOperator) {
        letOperator.data = this.of;
      }
    }
  }
}
