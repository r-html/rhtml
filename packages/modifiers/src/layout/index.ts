import {
  Component,
  html,
  LitElement,
  OnDestroy,
  OnUpdate,
  property,
  TemplateResult
} from '@rxdi/lit-html';

import { Attributes, recursion } from './modifiers';

@Component({
  selector: 'flex-layout',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class FlexLayout extends LitElement implements OnUpdate, OnDestroy {
  @property()
  child: LitElement;

  private observables: MutationObserver[] = [];

  OnUpdate(): void {
    this.updateAttributes();
  }

  OnDestroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    for (const observable of this.observables) {
      observable.disconnect();
    }
    this.observables = [];
  }

  private updateAttributes() {
    const slot = this.shadowRoot.querySelector('slot');
    for (const element of [...slot?.assignedElements()]) {
      if (this.isFxLayout(element)) {
        this.unsubscribe();
        this.subscribe(element);
      }
      recursion.call(this.child, element);
    }
  }

  private isFxLayout(element: Element) {
    return element.getAttribute(Attributes.FxLayout.toLowerCase());
  }

  private subscribe(element: Element) {
    this.unsubscribe();
    const observer = new MutationObserver(() => this.updateAttributes());
    observer.observe(element, {
      subtree: true,
      childList: true
    });
    this.observables.push(observer);
  }

  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <flex-layout .child=${this}>${template}</flex-layout>
    `;
  }
}
