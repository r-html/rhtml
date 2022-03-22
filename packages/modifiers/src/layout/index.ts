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
    const slot = this.shadowRoot.querySelector('slot');
    for (const div of [...slot?.assignedElements()]) {
      recursion.call(this.child, div as never);
    }
  }

  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <flex-layout .child=${this}>${template}</flex-layout>
    `;
  }
}
