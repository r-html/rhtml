import { LitElement, Component, html } from '@rxdi/lit-html';
import '../packages/core/src/index';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

interface State { counter: number }

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <rx-renderer
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
          loading: () => html`adadadad`,
          error: () => html`adadadadadada`
        }}
      ></rx-renderer>

      <rx-for .of=${['IterableItem 1', 'Iterable Item 2']}>
        <rx-let .item=${v => html`${v}`}></rx-let>
      </rx-for>

      <rx-monad>
        <rx-state .value=${''}></rx-state>
        <rx-render .state=${name => html`
          <p>${name}</p>
        `}>
        </rx-render>
      </rx-monad>

      <rx-monad>
        <rx-settings .value=${{ fetchPolicy: 'cache-first' }}></rx-settings>
        <rx-fetch query="{
          continents {
            name
          }
        }"></rx-fetch>
        <rx-render .state=${({ data: { continents } }) => html`
          <rx-for .of=${continents}>
            <rx-let .item=${({ name }) => name}></rx-let>
          </rx-for>
        `}>
        </rx-render>
      </rx-monad>

      <rx-monad>
        <rx-fetch subscribe="{ notifications { appUpdated } }"></rx-fetch>
        <rx-render .state=${({ data: { notifications: { appUpdated }}}) => html`
          <p>${appUpdated}</p>
        `}>
        </rx-render>
      </rx-monad>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
