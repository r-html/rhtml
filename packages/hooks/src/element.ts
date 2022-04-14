import { render, TemplateResult } from '@rxdi/lit-html';

import { renderWithHooks } from './hooks-core';

export interface HookElementOptions {
  observedAttributes: string[];
  shadowRoot?: boolean;
}

export const component = (
  renderFn: (e: HTMLElement) => TemplateResult,
  {
    observedAttributes,
    shadowRoot,
  }: HookElementOptions = {} as HookElementOptions
) =>
  class extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes || [];
    }
    connectedCallback() {
      if (shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
      this.render();
    }
    render() {
      render(
        renderWithHooks(this, renderFn, this.render.bind(this)),
        shadowRoot ? this.shadowRoot : this
      );
    }
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Value ${name} changed from ${oldValue} to ${newValue}`);
    }
  };
