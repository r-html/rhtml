# @rhtml/renderer

#### Installation

```bash
npm i @rhtml/renderer
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';

import '@rxdi/renderer';

interface State { counter: number; }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: { counter: 1 },
          render: (res: State, setState: (res: State) => State) =>
            html`
              <button
                @click=${() => setState({ counter: res.counter + res.counter })}
              >
                Increment
              </button>
              ${res.counter}
            `,
          loading: () =>
            html`
              Loading...
            `,
          error: () =>
            html`
              Error
            `
        }}
      ></r-renderer>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
```


##### Can be provided also `observable` value

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';

import '@rxdi/renderer';

interface State { counter: number; }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: new BehaviorSubject({ counter: 1 }),
          render: (res: State, setState: (res: State) => State) =>
            html`
              <button
                @click=${() => setState({ counter: res.counter + res.counter })}
              >
                Increment
              </button>
              ${res.counter}
            `,
          loading: () =>
            html`
              Loading...
            `,
          error: () =>
            html`
              Error
            `
        }}
      ></r-renderer>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
```
