import { TemplateResult } from '@rxdi/lit-html';

import { ComponentRegistry } from './component-registry';
import { RegistryReadyEvent, selector } from './interface';

export function Hydrate(template: TemplateResult) {
  return new Promise(resolve => {
    let registry = document.querySelector(selector) as ComponentRegistry;
    if (registry) {
      registry.register(template);
      resolve(registry);
    } else {
      const handler = () => {
        registry = document.querySelector(selector);
        registry.register(template);
        resolve(registry);
        window.removeEventListener(RegistryReadyEvent, handler);
      };
      window.addEventListener(RegistryReadyEvent, handler);
    }
  });
}
