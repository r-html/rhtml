import { Component, html, LitElement } from '@rxdi/lit-html';

@Component({
  selector: 'r-prop',
  template: () => html`
    <slot></slot>
  `
})
export class RPropOperator extends LitElement {}
