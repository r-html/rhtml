import '@rhtml/operators';

import {
  Component,
  html,
  LitElement,
  property,
  TemplateResult,
} from '@rxdi/lit-html';

import { RegistryReadyEvent, selector } from './interface';

/**
 * @customElement r-component-registry
 */
@Component({
  selector,
  template(this: ComponentRegistry) {
    return html`
      <r-for .of=${this.components}>
        <r-let .item=${(i) => i}></r-let>
      </r-for>
    `;
  },
})
export class ComponentRegistry extends LitElement {
  @property({ type: Array })
  private components = [];
  OnInit() {
    window.dispatchEvent(new Event(RegistryReadyEvent));
  }
  register(template: TemplateResult) {
    this.components = [...this.components, template];
  }
}

window.addEventListener('load', () =>
  document.body.append(document.createElement(selector))
);
