# @rhtml/hooks

#### Installation

```bash
npm i @rhtml/hooks
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { useState } from '@rhtml/hooks';

interface MonadState { myState: boolean }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-monad>
        <r-state .value=${{ myState: false }}></r-state>
        <r-render .state=${(s, setMonadState: (s: MonadState) => void) => {
          const [state$, setState, getState] = useState({ myState2: false });
          const state = getState();
          return html`
            <p>${state.myState2}</p>
            <p>${s.myState}</p>
            <button @click=${() => setState({ myState2: true })}>setHookState</button>
            <button @click=${() => setMonadState({ myState: true })}>setMonadState</button>
          `
        }}>
        </r-render>
      </r-monad>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
```
