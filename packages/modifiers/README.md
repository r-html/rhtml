# @rhtml/modifiers

#### Installation

```bash
npm i @rhtml/modifiers
```

Every modifier is actually `custom attribute` and modifiers is using package [@rhtml/custom-attributes](../custom-attributes)

#### Usage

Another real example is to add FlexLayout modifier from `@rhtml/modifiers` which will apply useful attributes
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
    .container {
      height: 200px;
    }

    .block {
      background: red;
      flex: 1;
    }
  `,
  modifiers: [...FlexLayout],
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

#### Angular Layout

`ngIf` attribute available at the moment to test the logic which represents

```typescript
import { Component, html, LitElement, state } from '@rxdi/lit-html';

import { AngularLayout } from '@rhtml/modifiers';

/**
 * @customElement home-component
 */
@Component({
  selector: 'home-component',
  modifiers: [...AngularLayout],
  template(this: HomeComponent) {
    return html`
      <div ngIf=${this.show}>
        My Content
      </div>

      <button @click=${() => this.toggle()}>Toggle</button>
    `;
  }
})
export class HomeComponent extends LitElement {
  @state()
  show: boolean;

  toggle() {
    this.show = !this.show;
  }
}
```
