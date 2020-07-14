# Reactive HTML

#### Installation

```bash
npm i @rhtml/operators @rhtml/components @rhtml/hooks @rhtml/graphql
```

#### Usage

```typescript
import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import '@rhtml/operators';
import '@rhtml/components';
import '@rhtml/hooks';
import '@rhtml/graphql';

interface State {
  counter: number;
}
interface NotificationState {
  data: { notifications: { appUpdated: string | number } };
}
@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: new BehaviorSubject({ counter: 1 }).pipe(delay(1700)),
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

      <r-for .of=${['IterableItem 1', 'Iterable Item 2']}>
        <r-let
          .item=${v => html`
            ${v}
          `}
        ></r-let>
      </r-for>

      <r-part>
        <r-state .value=${'Kristiyan Tachev'}></r-state>
        <r-render
          .state=${name => html`
            <p>${name}</p>
          `}
        >
        </r-render>
      </r-part>

      <r-part>
        <r-settings .value=${{ fetchPolicy: 'cache-first' }}></r-settings>
        <r-fetch .query=${`{ continents { name } }`}></r-fetch>
        <r-render
          .state=${({ data: { continents } }) => html`
            <r-for .of=${continents}>
              <r-let .item=${({ name }) => name}></r-let>
            </r-for>
          `}
        >
        </r-render>
      </r-part>

      <r-part>
        <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
        <r-render
          .state=${(
            {
              data: {
                notifications: { appUpdated }
              }
            },
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

## Setup Graphql Client

To set configuration on bundle time we need to get settings without `barrel` export,
this way we can set configuration before Graphql module loads configuration
Keep it in mind that this is the default configuration for GraphqlClient

```typescript
import { setConfig } from '@rhtml/graphql/settings';

setConfig({
  config: {
    uri: 'https://countries.trevorblades.com/',
    pubsub: 'wss://pubsub.youvolio.com/subscriptions',
    async onRequest() {
      return new Headers();
    }
  },
  defaults: {
    error: e => {
      return html`
        <p style="color: black">
          ${e}
        </p>
      `;
    },
    loading: () => {
      return html`
        <div style="text-align: center;">
          <rx-loading palette="danger"></rx-loading>
        </div>
      `;
    }
  }
});

import '@rhtml/graphql';
```

Later on you can use `r-fetch` component to specify `query`, `mutation`, `subscription`

```html
<r-part>
  <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
  <r-render .state=${({ data: { notifications: { appUpdated } } }, setState: (s: NotificationState) => void) => html`
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
  `}>
  </r-render>
</r-part>
```

##### Dependency Injection

```
npm i @rhtml/di
```

```ts
import '@abraham/reflection';

import { Inject, Injectable, InjectionToken } from '@rhtml/di';
import { Bootstrap, Component, Module } from '@rhtml/di/module';

type UserId = number;
const UserId = new InjectionToken<UserId>();

const now = Date.now();

@Injectable()
export class UserService {
  constructor(@Inject(UserId) public userId: number) {
    console.log('[UserService]', userId);
  }
}

@Component()
class AppComponent {
  constructor(public userService: UserService) {
    console.log('[AppComponent] ', userService.userId);
  }

  OnInit() {
    console.log('[AppComponent] Init');
  }

  OnDestroy() {
    console.log('[AppComponent] Destroy');
  }
}

@Module({
  providers: [
    UserService,
    {
      provide: UserId,
      useFactory: () =>
        new Promise<number>(resolve => setTimeout(() => resolve(1234), 1000))
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

Bootstrap(AppModule).then(() =>
  console.log('Started', `after ${Date.now() - now}`)
);
```
