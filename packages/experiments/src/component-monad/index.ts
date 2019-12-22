import { RComponentOperator } from './r-component';
import { RKeyOperator } from './r-key';
import { RPropOperator } from './r-prop';
import { RPropsOperator } from './r-props';
import { ComponentRegister } from './component-registry';

import './component-registry';

declare global {
  interface HTMLElementTagNameMap {
    'r-component': RComponentOperator;
    'r-key': RKeyOperator;
    'r-prop': RPropOperator;
    'r-component-register': ComponentRegister;
  }
}

export * from './r-component';
export * from './r-key';
export * from './r-prop';
export * from './r-props';
export * from './hydrate';
export * from './lit-service-element';
