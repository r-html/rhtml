import {
  adoptStyles,
  Component,
  css,
  html,
  LitElement,
  property,
} from '@rxdi/lit-html';

function Render(config) {
  return function (cls) {
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
      ${!this.loading ? this.renderContent() : ''}
      ${this.loading
        ? html`
            ${this.isFunction(this.options.loading)
              ? this.options.loading()
              : html``}
          `
        : ''}
      ${this.error
        ? html`
            ${this.isFunction(this.options.error)
              ? this.options.error(this.error)
              : html` ${this.error} `}
          `
        : ''}
    `;
  },
})
export class Renderer extends LitElement {
  @property({ type: Object })
  public options = {
    state: {},
    render: (
      res,
      setState: (state: Record<never, never>) => void,
      shadowRoot: ShadowRoot
    ) => html` ${res} `,
    style: css``,
    styles: [],
    deepCloneState: false,
    loading: () => html``,
    error: (e: Error) => html`${e?.message}`,
  };

  @property({ type: Boolean })
  private loading = true;

  @property({ type: Object })
  private error: Error;

  @property()
  private state = {};

  private subscription: { unsubscribe: () => void };

  async OnUpdateFirst() {
    if (this.options?.style) {
      adoptStyles(this.shadowRoot, [this.options.style]);
    }

    if (this.options?.styles?.length) {
      adoptStyles(this.shadowRoot, this.options.styles);
    }

    this.options.state = await this.options.state;
    if (this.options.state) {
      if (this.isObservable(this.options.state)) {
        this.subscription = this.options.state['subscribe'](
          (detail) => {
            this.state = detail;
            this.loading = false;
            this.dispatchEvent(new CustomEvent('onData', { detail }));
          },
          (error) => {
            this.state = null;
            this.error = error;
            this.loading = false;
            this.dispatchEvent(new CustomEvent('onError', { detail: error }));
          }
        );
      } else {
        this.loading = false;
        this.state = this.options.state;
      }
      await this.updateComplete;
      await new Promise(requestAnimationFrame);
      this.dispatchEvent(new CustomEvent('loaded'));
    }
  }
  private isObservable(value) {
    return this.isFunction(value.lift) && this.isFunction(value.subscribe);
  }

  private isFunction(value) {
    return typeof value === 'function';
  }

  OnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private renderContent() {
    if (!this.error && this.options.render) {
      const template = this.options.render(
        this.options.deepCloneState
          ? JSON.parse(JSON.stringify(this.state))
          : this.state,
        (state) => (this.state = { ...state }),
        this.shadowRoot
      );
      if (template?.strings) {
        return template;
      }
      return html``;
    }
    return this.state;
  }
}
