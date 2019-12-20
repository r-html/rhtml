import { Component, html, LitElement } from '@rxdi/lit-html';
import { Container } from '@rxdi/core';
import { RTemplateOperator } from './r-template';

@Component({
  selector: 'r-component',
  template: () => html`
    <slot></slot>
  `
})
export class RComponentOperator extends LitElement {
  async OnUpdate() {
    const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
    const selectorComponent = this.findNode(nodes, 'r-selector');
    const templateComponent = this.findNode(
      nodes,
      'r-template'
    ) as RTemplateOperator;
    const propertiesComponent = this.findNode(nodes, 'r-props');

    if (propertiesComponent) {
      await propertiesComponent.requestUpdate();
    }
    const selector = selectorComponent ? selectorComponent.innerHTML : null;

    if (!window.customElements.get(selector) && selector) {
      Component({ selector })(
        class extends LitElement {
          static get properties() {
            return propertiesComponent.props;
          }
          render = () => templateComponent.value(this)
        }
      );
    }

    if (templateComponent) {
      templateComponent.remove();
    }
    if (selectorComponent) {
      selectorComponent.remove();
    }
    if (propertiesComponent) {
      propertiesComponent.remove();
    }

    const script = this.findNode(nodes, 'script') as HTMLScriptElement;
    if (script) {
      await window.customElements.whenDefined(selector);
      new Function(script.innerHTML).call(
        await window.customElements.get(selector)
      );
      script.remove();
    }
    this.remove();
  }
  findNode(nodes, localName) {
    const node = nodes.find(
      n => n && n.nextSibling && n.nextSibling.localName === localName
    );
    return node ? node.nextSibling : null;
  }
}
