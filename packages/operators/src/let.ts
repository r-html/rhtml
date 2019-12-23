import { Component, LitElement, property, html } from '@rxdi/lit-html';
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
                render: s => this.normalizeArray(s).map(this.item)
              }}
            ></r-renderer>
          `
        : this.normalizeArray(this.data).map(this.item)}
    `;
  }
})
export class LetOperator extends LitElement {
  @property({ type: Array })
  public data: any = [];

  @property()
  public item: any = (v: any) =>
    html`
      ${v}
    `;

  private normalizeArray(state: Object) {
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
    return this.isFunction(value.lift) && this.isFunction(value.subscribe);
  }
  private isFunction(value) {
    return typeof value === 'function';
  }
}
