import {
  Component,
  html,
  LitElement,
  property,
  TemplateResult
} from '@rxdi/lit-html';

import { recursion } from './modifiers';

@Component({
  selector: 'flex-layout',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class FlexLayout extends LitElement {
  @property()
  child: LitElement;

  OnUpdate(): void {
    this.updateAttributes();
  }

  private updateAttributes() {
    const slot = this.shadowRoot.querySelector('slot');
    const elements = slot?.assignedElements() ?? [];
    for (const element of elements) {
      recursion.call(this.child, element);
    }
  }

  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <flex-layout .child=${this}>${template}</flex-layout>
    `;
  }
}
