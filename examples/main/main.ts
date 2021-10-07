import './setup-graphql';
import '@rhtml/hooks';
import '@rhtml/operators';
import '@rhtml/components';
import '@rhtml/graphql';
import '@rhtml/experiments';

import { Component, html, LitElement, property } from '@rxdi/lit-html';
import { interval } from 'rxjs';
import { of } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

import { NotificationState, State } from './interface';

interface IUser {
  id: number;
  name: string;
}
interface IState {
  loading: boolean;
  userId: number;
  user: IUser;
}

/**
 * @customElement user-service
 */
@Component({
  selector: 'user-service'
})
export class UserService extends LitElement {
  @property()
  run: (self: UserService) => void;

  OnUpdateFirst() {
    this.remove();
    this.run.call(this);
  }

  getUserById(id: number) {
    return of({ id, name: 'Kristyian Tachev' })
      .pipe(delay(2000))
      .toPromise();
  }
}

@Component({
  selector: 'r-html-view',
  template(this: RHtmlViewComponent) {
    return html`
      <r-renderer
        .options=${{
          state: of({ counter: 1 }).pipe(delay(1000)),
          render: ({ counter }: State, setState: (res: State) => State) => html`
            <button @click=${() => setState({ counter: counter * 3 })}>
              Increment x3
            </button>
            ${counter}
          `,
          loading: () => html`
            <r-part>
              <r-state .value=${interval(100).pipe(map(i => i / 10))}></r-state>
              <r-render
                .state=${(g, s) =>
                  html`
                    Loading ${g}s...
                  `}
              ></r-render>
            </r-part>
          `,
          error: () =>
            html`
              Error
            `
        }}
      >
      </r-renderer>

      <r-part>
        <r-state .value=${{ loading: true, userId: 1, user: {} }}></r-state>
        <r-render
          .state=${(
            { userId, loading, user }: IState,
            setState: (state: IState) => void
          ) => html`
            <user-service
              .run=${async function(this: UserService) {
                setState({
                  userId,
                  user: await this.getUserById(userId),
                  loading: false
                });
              }}
            ></user-service>
            <r-if .exp=${loading}>Loading</r-if>
            <r-if .exp=${!loading}>
              <p>User id: ${user.id}</p>
              <p>User name: ${user.name}</p>
            </r-if>
          `}
        >
        </r-render>
      </r-part>

      <r-component>
        <r-selector>r-counter</r-selector>
        <r-props>
          <r-prop key="value" type="Number"></r-prop>
        </r-props>
        <r-render
          .state=${(state, setState) => html`
            <button
              @click=${() =>
                setState({ value: state.value + state.value, loading: false })}
            >
              Increment
            </button>
            <user-service
              .run=${async function(this: UserService) {
                setState({ user: await this.getUserById(1), loading: false });
              }}
            ></user-service>
            <r-if .exp=${state.loading}>Loading...</r-if>
            <p>${state.value}</p>
            <p>User: ${JSON.stringify(state.user)}</p>
          `}
        >
        </r-render>
      </r-component>

      <r-counter value="100000"></r-counter>

      <!-- <r-for
        .of=${interval(1000).pipe(
        scan((acc, curr) => [...acc, `Item #${curr}`], [])
      )}
      >
        <r-let
          .item=${v => html`
        <p>${v}</p>
      `}
        ></r-let>
      </r-for> -->

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

      <r-component>
        <r-selector>r-pesho</r-selector>
        <r-props>
          <r-prop key="pesho" type="Number"></r-prop>
          <r-prop key="pesho2" type="Boolean"></r-prop>
          <r-prop key="pesho3" type="String"></r-prop>
        </r-props>
        <r-render
          .state=${s => html`
            ${s.pesho} | ${s.pesho2} | ${s.pesho3}
          `}
        >
        </r-render>
      </r-component>
    `;
  }
})
export class RHtmlViewComponent extends LitElement {}
