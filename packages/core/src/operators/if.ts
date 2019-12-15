import { Component, LitElement, html, property } from '@rxdi/lit-html';

/**
 * @customElement rx-if
 */
@Component({
  selector: 'rx-if',
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
