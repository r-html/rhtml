import { Component, html, LitElement, property } from '@rxdi/lit-html';
/**
 * @customElement r-let
 */
@Component({
  selector: 'r-let',
  template(this: LetOperator) {
    return html`
      ${this.isObservable(this.data)
        ? html`
            <r-renderer
              .options=${{
                state: this.data,
                render: (state, set, shadowRoot) => {
                  this.parentElement.parentNode.insertBefore(
                    shadowRoot,
                    this.parentElement.nextSibling
                  );
                  return html`${this.normalizeArray(state).map(this.item)}`;
                },
              }}
            ></r-renderer>
          `
        : this.normalizeArray(this.data).map(this.item)}
    `;
  },
})
export class LetOperator extends LitElement {
  @property({ type: Array })
  public data = [];

  @property({ type: Object })
  public item = (v) => html` ${v} `;
  OnUpdateFirst() {
    if (!this.isObservable(this.data)) {
      this.parentElement.parentNode.insertBefore(
        this.shadowRoot,
        this.parentElement.nextSibling
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeArray(state: Record<string, any>) {
    if (!state || typeof state === 'string') {
      return [];
    }
    if (typeof state === 'number') {
      return Array.from(Array(state), (v, i) => i);
    }
    /* https://javascript.info/map-set */
    if (state instanceof Map || state instanceof Set) {
      return [...state.entries()];
    }
    if (!Array.isArray(state)) {
      return Object.entries(state);
    }
    return state;
  }

  private isObservable(value) {
    return (
      value && this.isFunction(value.lift) && this.isFunction(value.subscribe)
    );
  }
  private isFunction(value) {
    return typeof value === 'function';
  }
}
