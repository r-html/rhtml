import { LitElement, Component, html } from '@rxdi/lit-html';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

import '../packages/operators/src/index';
import '../packages/components/src/index';
import '../packages/hooks/src/index';
import '../packages/graphql/src/index';

interface State { counter: number }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: new BehaviorSubject({ counter: 1 }).pipe(
            delay(1700),
          ),
          render: (
            res: State,
            setState: (res: State) => State
          ) =>
            html`
              <button
                @click=${() => setState({ counter: res.counter + res.counter })}
                >Increment</button>
              ${res.counter}
            `,
          loading: () => html`Loading...`,
          error: () => html`Error`
        }}
      ></r-renderer>

      <r-for .of=${['IterableItem 1', 'Iterable Item 2']}>
        <r-let .item=${v => html`${v}`}></r-let>
      </r-for>

      <r-part>
        <r-state .value=${'dadada'}></r-state>
        <r-render .state=${name => html`
          <p>${name}</p>
        `}>
        </r-render>
      </r-part>

      <r-part>
        <r-settings .value=${{ fetchPolicy: 'cache-first' }}></r-settings>
        <r-fetch .query=${`{ continents { name } }`}></r-fetch>
        <r-render .state=${({ data: { continents } }) => html`
          <r-for .of=${continents}>
            <r-let .item=${({ name }) => name}></r-let>
          </r-for>
        `}>
        </r-render>
      </r-part>

      <r-part>
        <r-fetch .subscribe=${`{ notifications { appUpdated } }`}></r-fetch>
        <r-render .state=${({ data: { notifications: { appUpdated }}}) => html`
          <p>${appUpdated}</p>
        `}>
        </r-render>
      </r-part>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
