# @rhtml/operators

#### Installation

```bash
npm i @rhtml/operators
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';

import '@rhtml/operators';

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-for .of=${['IterableItem 1', 'Iterable Item 2']}>
        <r-let .item=${v => html``}></r-let>
      </r-for>

      <r-let .data=${['IterableItem 1', 'Iterable Item 2']} .item=${v => html`
        dadada
      `}></r-let>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}

```
