import { Container, Inject } from '@rxdi/core';
import {
  async,
  Component,
  css,
  html,
  LitElement,
  property,
} from '@rxdi/lit-html';
import {
  MutationOptions,
  QueryBaseOptions,
  QueryOptions,
  SubscriptionOptions,
} from 'apollo-client';
import gql from 'graphql-tag';
import {
  BehaviorSubject,
  isObservable,
  Observable,
  of,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BaseService } from './base.service';
import { DEFAULTS } from './tokens';
import { GraphOptions } from './types';

/**
 * @customElement r-graph
 */
@Component({
  selector: 'r-graph',
  template(this: GraphComponent) {
    return html`
      <style>
        ${this.options?.style}
      </style>
      ${async(
        this.result.pipe(
          map((state) =>
            this.options.render
              ? this.options.render(
                  state,
                  (data) => this.result.next(data),
                  this.shadowRoot
                )
              : state
          ),
          tap(() => (this.loading = false)),
          catchError((e) => {
            this.error = e;
            this.loading = false;
            return of('');
          })
        )
      )}
      ${this.loading
        ? html`
            ${typeof this.options.loading === 'function'
              ? this.options.loading()
              : Container.get(DEFAULTS).loading()}
          `
        : ''}
      ${this.error
        ? html`
            ${typeof this.options.error === 'function'
              ? this.options.error(this.error)
              : Container.get(DEFAULTS).error(this.error)}
          `
        : ''}
      <slot></slot>
    `;
  },
})
export class GraphComponent extends LitElement {
  @property({ type: Object })
  public options: GraphOptions = {
    fetch: '',
    style: css``,
    state: new BehaviorSubject({}),
    render: (res) => html` ${res} `,
    loading: () => html``,
    error: () => html``,
    settings: {} as QueryBaseOptions,
  };

  @Inject(BaseService)
  private graphql: BaseService;

  @property({ type: Boolean })
  private loading = true;

  @property({ type: String })
  private error = '';

  private subscription: Subscription;
  private pubsubSubscription: Subscription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private result: ReplaySubject<any>;
  OnInit() {
    this.result = new ReplaySubject();
  }
  OnUpdateFirst() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let task: Observable<any>;
    if (this.options.state) {
      if (isObservable(this.options.state)) {
        task = this.options.state;
      } else {
        this.result.next(this.options.state);
      }
    } else {
      try {
        task = this.query();
      } catch (e) {
        this.result.error(e);
        this.result.complete();
      }
    }
    if (this.options.subscribe) {
      this.pubsubSubscription = this.graphql
        .subscribe({
          query: gql`
            ${this.options.subscribe}
          `,
        })
        .subscribe(
          (data) => this.result.next(data),
          (e) => this.result.error(e)
        );
    }
    if (!task) {
      return;
    }
    this.subscription = task.subscribe(
      (detail) => {
        this.result.next(detail);
        this.dispatchEvent(new CustomEvent('onData', { detail }));
      },
      (error) => {
        if (error && error.networkError) {
          if (error.networkError.result) {
            error.message = `${JSON.stringify(
              error.networkError.result.errors
            )} ${error.message}`;
          }
        }
        this.result.error(error);
        this.dispatchEvent(new CustomEvent('onError', { detail: error }));
      }
    );
  }

  OnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.pubsubSubscription) {
      this.pubsubSubscription.unsubscribe();
    }
    this.result.complete();
  }

  private query(): Observable<{ data }> {
    let fetch = this.options.fetch;
    this.options.settings = this.options.settings || {};
    this.options.fetch = this.options.fetch || '';
    if (this.options.fetch['loc'] && this.options.fetch['loc'].source) {
      fetch = this.options.fetch['loc'].source.body;
    }
    if (typeof fetch === 'string' && fetch.includes('mutation')) {
      this.options.settings.mutation = gql`
        ${fetch}
      `;
      return this.graphql.mutate(this.options.settings as MutationOptions);
    }
    this.options.settings.query =
      typeof fetch !== 'string'
        ? fetch
        : gql`
            ${fetch}
          `;

    if (typeof fetch === 'string' && fetch.includes('subscription')) {
      return this.graphql.subscribe(
        this.options.settings as SubscriptionOptions
      );
    }
    return this.graphql.query(this.options.settings as QueryOptions);
  }

  isPrimitive(test) {
    return test !== Object(test);
  }
}
