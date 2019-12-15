import { Component, html, property, LitElement, async } from '@rxdi/lit-html';
import { map, tap, catchError } from 'rxjs/operators';
import {
  Observable,
  of,
  Subscription,
  ReplaySubject,
  BehaviorSubject,
  isObservable
} from 'rxjs';
import { RenderOptions } from './types';

/**
 * @customElement r-renderer
 */
@Component({
  selector: 'r-renderer',
  template(this: Renderer) {
    return html`
      ${async(
        this.result.pipe(
          map(state =>
            this.options.render
              ? this.options.render(state, data => this.result.next(data))
              : state
          ),
          tap(() => (this.loading = false)),
          catchError(e => {
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
              : html`
                  Default
                `}
          `
        : ''}
      ${this.error
        ? html`
            ${typeof this.options.error === 'function'
              ? this.options.error(this.error)
              : html`
                  Default ${this.error}
                `}
          `
        : ''}
      <slot></slot>
    `;
  }
})
export class Renderer extends LitElement {
  @property({ type: Object })
  public options: any = <RenderOptions>{
    state: new BehaviorSubject({}),
    render: function(res) {
      return html`
        ${res}
      `;
    },
    loading: () => html``,
    error: () => html``
  };

  @property({ type: Boolean })
  private loading = true;

  @property({ type: String })
  private error = '';

  private subscription: Subscription;
  private result: ReplaySubject<any> = new ReplaySubject();

  OnUpdateFirst() {
    let task: Observable<any>;
    if (this.options.state) {
      if (isObservable(this.options.state)) {
        task = this.options.state;
        this.subscription = task.subscribe(
          detail => {
            this.result.next(detail);
            this.dispatchEvent(new CustomEvent('onData', { detail }));
          },
          error => {
            if (error.networkError) {
              error.message = `${JSON.stringify(
                error.networkError.result.errors
              )} ${error.message}`;
            }
            this.result.error(error);
            this.dispatchEvent(new CustomEvent('onError', { detail: error }));
          }
        );
      } else {
        this.result.next(this.options.state);
      }
    }
  }

  OnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.result.complete();
  }
}
