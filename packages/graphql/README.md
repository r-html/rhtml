# @rhtml/graphql

#### Installation

```bash
npm i @rhtml/graphql
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import '@rhtml/components';
import '@rhtml/operators';
import '@rhtml/graphql';

interface State { counter: number }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-part>
        <r-settings .value=${{ fetchPolicy: 'cache-first' }}></r-settings>
        <r-fetch query="{
          continents {
            name
          }
        }"></r-fetch>
        <r-render .state=${({ data: { continents } }: IQueryData) => html`
          <r-for .of=${continents}>
            <r-let .item=${({ name }: IContinent) => name}></r-let>
          </r-for>
        `}>
        </r-render>
      </r-part>

      <r-part>
        <!-- <r-state .value=${interval(1000).pipe(map(i => ({ data: { notifications: { appUpdated: i } } })))}></r-state> -->
        <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
        <r-render .state=${(
            { data: { notifications: { appUpdated } }}: NotificationState,
            setState: (s: NotificationState) => void
          ) => html`
            <p>${appUpdated}</p>
            <button
              @click=${() => {
                setState({
                  data: {
                    notifications: {
                      appUpdated: Number(appUpdated) + Number(appUpdated)
                    }
                  }
                });
              }}
            >
              Increment Subscriptions State x2
            </button>
            (will be overriten when server emit new state)
          `}
        >
        </r-render>
      </r-part>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}

```
