/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, LitElement, property } from '@rxdi/lit-html';

/**
 * @customElement rx-style
 */
@Component({
  selector: 'r-style'
})
export class StyleComponent extends LitElement {
  @property() value: any;
}
