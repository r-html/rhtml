import { LitElement, Component, html, query } from '@rxdi/lit-html';
import { BehaviorSubject, interval } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import './setup-graphql';

import '@rhtml/hooks';
import '@rhtml/operators';
import '@rhtml/components';
import '@rhtml/graphql';
import '@rhtml/experiments';

import { State, NotificationState } from './interface';
interface RPeshoComponent {
  pesho: string;
  pesho2: string;
  pesho3: string;
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
            <p>
              <r-pesho
                pesho=${appUpdated}
                pesho2="1"
                pesho3="az sym 1"
              ></r-pesho>
            </p>

            <p>
              <r-pesho
                pesho=${appUpdated}
                pesho2="2"
                pesho3="az sym 2"
              ></r-pesho>
            </p>
            <p>
              <r-pesho
                pesho=${appUpdated}
                pesho2="3"
                pesho3="az sym 3"
              ></r-pesho>
            </p>
            (will be overriten when server emit new state)
          `}
        >
        </r-render>
      </r-part>

      <!-- Define webcomponent 'r-pesho' with properties pesho, pesho2, pesho3 -->
      <r-component>
        <r-selector>r-pesho</r-selector>
        <r-props>
          <r-prop key="pesho" type="Number"></r-prop>
          <r-prop key="pesho2" type="Boolean"></r-prop>
          <r-prop key="pesho3" type="String"></r-prop>
        </r-props>
        <r-render .state=${(s: RPeshoComponent) => html`
          ${s.pesho} | ${s.pesho2} | ${s.pesho3}
        `}>
        </r-render>
      </r-component>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
