import { Component, TemplateResult, LitElement } from '@rxdi/lit-html';

export function Hydrate(template: TemplateResult) {
  window.addEventListener('load', () => {
    const selector = `r-service-module-${Math.random()
      .toString(36)
      .substring(7)}`;
    const serviceModule = document.createElement(selector);
    Component({ selector, template: () => template })(
      class extends LitElement {
        OnUpdateFirst() {
          setTimeout(() => serviceModule.remove(), 0);
        }
      }
    );
    document.body.append(serviceModule);
  });
}
