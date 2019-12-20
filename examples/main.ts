import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject, interval } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import './setup-graphql';

import '../packages/operators/src/index';
import '../packages/components/src/index';
import '../packages/hooks/src/index';
import '../packages/graphql/src/index';
import '../packages/experiments/src/index';

import { State, NotificationState } from './interface';

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
        <!-- <r-state .value=${interval(1000).pipe(
          map(i => ({ data: { notifications: { appUpdated: i } } }))
        )}></r-state> -->
        <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
        <r-render
          .state=${(
            {
              data: {
                notifications: { appUpdated }
              }
            }: NotificationState,
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
            <r-pesho
              pesho=${appUpdated}
              pesho2="ed"
              pesho3="az sym pesh4o3"
            ></r-pesho>
            <r-pesho
              pesho=${appUpdated}
              pesho2="dve"
              pesho3="az sym pesho443"
            ></r-pesho>
            <r-pesho
              pesho=${appUpdated}
              pesho2="tre"
              pesho3="az sym pesh4o3"
            ></r-pesho>
            (will be overriten when server emit new state)
          `}
        >
        </r-render>
      </r-part>

      <!-- Define webcomponent 'r-pesho' with properties pesho, pesho2, pesho3 -->
      <r-component>
        <r-selector>r-pesho</r-selector>
        <r-template .value=${(s) => html`${s.pesho}daad ${s.pesho2}`}></r-template>
        <r-props>
          <r-prop>
            <r-key>pesho</r-key>
            <r-value>String</r-value>
          </r-prop>
          <r-prop>
            <r-key>pesho2</r-key>
            <r-value>String</r-value>
          </r-prop>
          <r-prop>
            <r-key>pesho3</r-key>
            <r-value>String</r-value>
          </r-prop>
        </r-props>
      </r-component>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
