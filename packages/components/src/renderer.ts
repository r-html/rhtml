import { Component, html, property, LitElement } from '@rxdi/lit-html';
/**
 * @customElement r-renderer
 */
@Component({
  selector: 'r-renderer',
  template(this: Renderer) {
    return html`
      ${this.options.render
        ? this.options.render(this.state, s => (this.state = s))
        : this.state}
      ${this.loading
        ? html`
            ${this.isFunction(this.options.error)
              ? this.options.loading()
              : html``}
          `
        : ''}
      ${this.error
        ? html`
            ${this.isFunction(this.options.error)
              ? this.options.error(this.error)
              : html`
                  ${this.error}
                `}
          `
        : ''}
    `;
  }
})
export class Renderer extends LitElement {
  @property()
  public options: any = {
    state: {},
    render: res =>
      html`
        ${res}
      `,
    loading: () => html``,
    error: () => html``
  };

  @property({ type: Boolean })
  private loading = true;

  @property({ type: String })
  private error = '';
  @property()
  private state = {};
  private subscription;
  OnUpdateFirst() {
    if (this.options.state) {
      if (
        this.isFunction(this.options.state.lift) &&
        this.isFunction(this.options.state.subscribe)
      ) {
        this.subscription = this.options.state.subscribe(
          detail => {
            this.state = detail;
            this.loading = false;
            this.dispatchEvent(new CustomEvent('onData', { detail }));
          },
          error => {
            this.state = {};
            this.error = error;
            this.loading = false;
            this.dispatchEvent(new CustomEvent('onError', { detail: error }));
          }
        );
      } else {
        this.loading = false;
        this.state = this.options.state;
      }
    }
  }

  isFunction(value: any) {
    return typeof value === 'function';
  }

  OnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

// import { Component, html, property, LitElement, async } from '@rxdi/lit-html';
// import { map, tap, catchError } from 'rxjs/operators';
// import {
//   Observable,
//   of,
//   Subscription,
//   ReplaySubject,
//   BehaviorSubject,
//   isObservable
// } from 'rxjs';
// import { RenderOptions } from './types';

// /**
//  * @customElement r-renderer
//  */
// @Component({
//   selector: 'r-renderer',
//   template(this: Renderer) {
//     return html`
//       ${async(
//         this.result.pipe(
//           map(state =>
//             this.options.render
//               ? this.options.render(state, data => this.result.next(data))
//               : state
//           ),
//           tap(() => (this.loading = false)),
//           catchError(e => {
//             this.error = e;
//             this.loading = false;
//             return of('');
//           })
//         )
//       )}
//       ${this.loading
//         ? html`
//             ${typeof this.options.loading === 'function'
//               ? this.options.loading()
//               : html``}
//           `
//         : ''}
//       ${this.error
//         ? html`
//             ${typeof this.options.error === 'function'
//               ? this.options.error(this.error)
//               : html`
//                   ${this.error}
//                 `}
//           `
//         : ''}
//       <slot></slot>
//     `;
//   }
// })
// export class Renderer extends LitElement {
//   @property({ type: Object })
//   public options: any = <RenderOptions>{
//     state: new BehaviorSubject({}),
//     render: function(res) {
//       return html`
//         ${res}
//       `;
//     },
//     loading: () => html``,
//     error: () => html``
//   };

//   @property({ type: Boolean })
//   private loading = true;

//   @property({ type: String })
//   private error = '';

//   private subscription: Subscription;
//   private result: ReplaySubject<any> = new ReplaySubject();

//   OnUpdateFirst() {
//     let task: Observable<any>;
//     if (this.options.state) {
//       if (isObservable(this.options.state)) {
//         task = this.options.state;
//         this.subscription = task.subscribe(
//           detail => {
//             this.result.next(detail);
//             this.dispatchEvent(new CustomEvent('onData', { detail }));
//           },
//           error => {
//             if (error.networkError) {
//               error.message = `${JSON.stringify(
//                 error.networkError.result.errors
//               )} ${error.message}`;
//             }
//             this.result.error(error);
//             this.dispatchEvent(new CustomEvent('onError', { detail: error }));
//           }
//         );
//       } else {
//         this.result.next(this.options.state);
//       }
//     }
//   }

//   OnDestroy() {
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//     this.result.complete();
//   }
// }
