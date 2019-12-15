# @rhtml/hooks

#### Installation

```bash
npm i @rhtml/hooks
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { useState } from '@rhtml/hooks';

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <rx-monad>
        <rx-state .value=${{ myState: false }}></rx-state>
        <rx-render .state=${(s) => {
          const [state$, setState, getState] = useState(s)
          const state = getState();
          return html`
            <p>${state.myState}</p>
            <button @click=${() => setState({ myState: true })}></button>
          `
        }}>
        </rx-render>
      </rx-monad>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
```
