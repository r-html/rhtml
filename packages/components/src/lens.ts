import { Component, LitElement, property } from '@rxdi/lit-html';

/**
 * @customElement r-lens
 */
@Component({
  selector: 'r-lens'
})
export class LensComponent extends LitElement {
  @property({ type: String }) match: string;
  @property({ type: Array }) get: (number | string | Function)[];
  @property({ type: Object }) ray: <T>(res: T) => T = res => res;
}
