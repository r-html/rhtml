import { Component } from '@rhtml/component';
import { html, LitElement } from '@rxdi/lit-html';

@Component({
  Settings: {
    selector: 'r-html-view',
  },
  Render: () =>
    function (this: RHtmlViewComponent) {
      return html` dada `;
    },
})
export class RHtmlViewComponent extends LitElement {}
