import { Component, html, property, LitElement } from '@rxdi/lit-html';

function Render(config) {
  return function(cls) {
    if (!window.customElements.get(config.selector)) {
      return Component(config)(cls);
    }
  };
}

/**
 * @customElement r-renderer
 */
@Render({
  selector: 'r-renderer',
  template(this: Renderer) {
    return html`
      ${!this.loading
        ? this.options.render
          ? this.options.render(this.state, s => (this.state = s))
          : this.state
        : ''}
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
      if (this.isObservable(this.options.state)) {
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

  private isObservable(value: any) {
    return this.isFunction(value.lift) && this.isFunction(value.subscribe);
  }

  private isFunction(value: any) {
    return typeof value === 'function';
  }

  OnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
