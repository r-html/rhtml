import { Component, html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'r-props',
  template: () => html`
    <slot></slot>
  `
})
export class RPropsOperator extends LitElement {
  private nodes: NodeListOf<Element>;
  public props = {};
  OnUpdate() {
    this.nodes = this.querySelectorAll('r-prop');
    this.nodes.forEach(n => {
      const key = n.querySelector('r-key');
      const value = n.querySelector('r-value');
      this.props[key.innerHTML] = value.innerHTML;
    });
  }
  OnDestroy() {
    this.nodes.forEach(n => n.remove());
  }
}
