# @rhtml/modifiers

#### Installation

```bash
npm i @rhtml/modifiers
```

#### Modifiers

What is a modifier ?

In order to apply some logic before current template is loaded like custom directives, we need to wrap current template and pass it along the actual modifier template

```typescript
@Component({
  selector: 'my-modifier',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class MyModifier extends LitElement {
  OnUpdate() {
    const slot = this.shadowRoot.querySelector('slot');
    for (const element of [...slot.assignedElements()]) {
      /// Do something here with element
    }
  }

  public static html(template: TemplateResult) {
    return html`
      <my-modifier>${template}</my-modifier>
    `;
  }
}
```

Another real example is to add FlexLayout modifier from `@rhtml/modifiers` which will apply useful directives
to be used inside of the html inspired from Angular flex-layout https://github.com/angular/flex-layout/wiki/Declarative-API-Overview

```typescript
import { Component, css, html, LitElement } from '@rxdi/lit-html';

import { FlexLayout } from '@rhtml/modifiers';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  style: css`
    .block {
      background: red;
      flex: 1;
    }
    .container {
      height: 200px;
    }
  `,
  modifiers: [FlexLayout],
  template(this: HomeComponent) {
    return html`
      <div class="container" fxLayout="row" fxLayoutGap="10px">
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>A</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>B</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>C</div>
        </div>
        <div>
          <div class="block" fxLayoutAlign="center center" fxFlexFill>D</div>
        </div>
      </div>
    `;
  }
})
export class HomeComponent extends LitElement {}
```
