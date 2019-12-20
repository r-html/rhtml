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
      const k = n.querySelector('r-key');
      const t = n.querySelector('r-type');
      const key = n['key'] || k.innerHTML;
      let type = n['type'] || t.innerHTML;
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

  isString(value: any) {
    return value === 'String';
  }

  isNumber(value: any) {
    return value === 'Number';
  }

  isBoolean(value: any) {
    return value === 'Boolean';
  }

  isObject(value: any) {
    return value === 'Object';
  }

  castToType(value: any, type: String | Boolean | Number | Object) {}
}
