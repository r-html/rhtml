import { Component, html, LitElement } from '@rxdi/lit-html';

/**
 * @customElement r-component
 */
@Component({
  selector: 'r-component',
  template: () => html`
    <slot></slot>
  `
})
export class RComponentOperator extends LitElement {
  async OnUpdateFirst() {
    const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
    const selectorComponent = this.findNode(nodes, 'r-selector');
    const renderComponent = this.findNode(nodes, 'r-render');

    const propertiesComponent = this.findNode(nodes, 'r-props');

    if (propertiesComponent) {
      await propertiesComponent.requestUpdate();
    }
    const selector = selectorComponent ? selectorComponent.innerHTML : null;

    if (!window.customElements.get(selector) && selector) {
      Component({
        selector,
        template() {
          return renderComponent
            ? renderComponent.state(this, (state: any) => Object.assign(this, state))
            : html`
                Missing template
              `;
        }
      })(
        class extends LitElement {
          loading = true;
          static get properties() {
            return {...propertiesComponent.props, loading: { type: Boolean }};
          }
        }
      );
    }

    if (renderComponent) {
      renderComponent.remove();
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
