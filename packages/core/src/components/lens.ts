import { LitElement, Component, property } from '@rxdi/lit-html';

/**
 * @customElement rx-lens
 */
@Component({
  selector: 'rx-lens'
})
export class LensComponent extends LitElement {
  @property({ type: String }) match: string;
  @property({ type: Array }) get: (number | string | Function)[];
  @property({ type: Object }) ray: <T>(res: T) => T = (res) => res;
}
