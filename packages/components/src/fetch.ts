import { Component, LitElement, property } from '@rxdi/lit-html';
/**
 * @customElement r-fetch
 */
@Component({
  selector: 'r-fetch'
})
export class FetchComponent extends LitElement {
  @property() query: string;
  @property() mutate: string;
  @property() subscribe: string;
}
