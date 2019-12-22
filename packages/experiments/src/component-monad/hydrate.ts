import { TemplateResult } from '@rxdi/lit-html';
import { ComponentRegister } from './component-registry';
import { RegistryReadyEvent, selector } from './interface';

export function Hydrate(template: TemplateResult) {
  return new Promise(resolve => {
    let registry = document.querySelector(selector) as ComponentRegister;
    if (registry) {
      registry.register(template);
      resolve(registry);
    } else {
      window.addEventListener(RegistryReadyEvent, () => {
        registry = document.querySelector(selector);
        registry.register(template);
        resolve(registry);
      });
    }
  });
}
