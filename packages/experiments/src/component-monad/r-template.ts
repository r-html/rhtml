import { property, Component, html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'r-template',
  template: () => html`
    <slot></slot>
  `
})
export class RTemplateOperator extends LitElement {
  @property({ type: Object })
  value = (self) => html``;
}
