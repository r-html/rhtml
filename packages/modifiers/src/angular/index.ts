import {
  Component,
  html,
  LitElement,
  OnDestroy,
  OnUpdateFirst,
  property,
  query,
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
export class AngularLayout extends LitElement
  implements OnUpdateFirst, OnDestroy {
  /* Keep in mind that `this` here is the parent component where modifier will be used */
  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <angular-layout .parent=${this}>${template}</angular-layout>
    `;
  }

  @property()
  public parent: LitElement;

  @query('slot')
  private container: HTMLSlotElement;

  private observer: MutationObserver;

  OnUpdateFirst() {
    this.triggerChanges();
    this.listenForTreeChanges();
  }

  OnDestroy() {
    this.observer.disconnect();
  }

  private listenForTreeChanges() {
    this.observer = new MutationObserver(() => this.triggerChanges());
    this.observer.observe(this.parent.shadowRoot, {
      subtree: true,
      childList: true
    });
  }

  private triggerChanges() {
    for (const div of this.container.assignedElements()) {
      recursion.call(this.parent, div);
    }
  }
}
