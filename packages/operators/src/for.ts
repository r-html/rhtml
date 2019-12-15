import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { Observable, isObservable, of } from 'rxjs';
import { LetOperator } from './let';

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
  public of: any[] | Observable<any[]> = of([]);
  OnUpdate() {
    const slotNodes = this.shadowRoot.querySelector('slot').assignedNodes();
    if (slotNodes.length) {
      const slotNode = slotNodes[0];
      const letOperator = slotNode.nextSibling as LetOperator;
      if (letOperator) {
        if (isObservable(this.of)) {
          letOperator.data = this.of;
        } else {
          letOperator.data = of(this.of);
        }
      }
    }
  }
}
