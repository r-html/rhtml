import { Component, html, LitElement, property } from '@rxdi/lit-html';

/**
 * @customElement r-if
 */
@Component({
  selector: 'r-if',
  template(this: IfOperator) {
    return html`
      ${this.exp
        ? html`
            <slot></slot>
          `
        : ''}
    `;
  }
})
export class IfOperator extends LitElement {
  @property({ type: Boolean }) exp: boolean;
}
