import {
  Component,
  html,
  LitElement,
  property,
  TemplateResult
} from '@rxdi/lit-html';

import { isAttribute, subscribeToAttributeChanges } from '../helpers';

export enum Attributes {
  NgIf = 'ngIf'
}

function recursion(div: HTMLElement) {
  const ngIf = div.getAttribute(Attributes.NgIf);

  if (isAttribute(ngIf)) {
    subscribeToAttributeChanges(Attributes.NgIf)(
      element =>
        (element.style.display =
          element.getAttribute(Attributes.NgIf) === 'true' ? 'block' : 'none')
    )(div);
  }

  const divs = [...div.children] as HTMLElement[];
  for (const div of divs) {
    recursion.call(this, div);
  }
}

@Component({
  selector: 'angular-layout',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class AngularLayout extends LitElement {
  @property()
  self: LitElement;

  OnUpdate(): void {
    const slot = this.shadowRoot.querySelector('slot');
    for (const div of [...slot?.assignedElements()]) {
      recursion.call(this.self, div as never);
    }
  }

  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <angular-layout .self=${this}>${template}</angular-layout>
    `;
  }
}
