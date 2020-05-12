import { Component, html, LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-props
 */
@Component({
  selector: 'r-props',
  template: () => html`
    <slot></slot>
  `
})
export class RPropsOperator extends LitElement {
  private nodes: NodeListOf<Element>;
  public props = {};
  OnUpdateFirst() {
    this.nodes = this.querySelectorAll('r-prop');

    this.nodes.forEach(n => {
      const k = n.querySelector('r-key');
      const t = n.querySelector('r-type');
      const key = n['key'] || k.innerText;
      let type = n['type'] || t.innerText;
      if (this.isString(type)) {
        type = String;
      }
      if (this.isNumber(type)) {
        type = Number;
      }
      if (this.isBoolean(type)) {
        type = Boolean;
      }
      if (this.isObject(type)) {
        type = Object;
      }
      this.props[key] = { type };
    });
  }
  OnDestroy() {
    this.nodes.forEach(n => n.remove());
  }

  isString(value) {
    return value === 'String';
  }

  isNumber(value) {
    return value === 'Number';
  }

  isBoolean(value) {
    return value === 'Boolean';
  }

  isObject(value) {
    return value === 'Object';
  }
}
