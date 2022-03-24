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

import { recursion } from './modifiers';

@Component({
  selector: 'flex-layout',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class FlexLayout extends LitElement implements OnUpdateFirst, OnDestroy {
  /* Keep in mind that `this` here is the parent component where modifier will be used */
  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <flex-layout .parent=${this}>${template}</flex-layout>
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
