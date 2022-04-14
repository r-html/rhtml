import { LitElement, property } from '@rxdi/lit-html';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LitServiceElement<T = any> extends LitElement {
  @property({ type: Object })
  run: (self: T) => void = () => null;

  OnUpdateFirst() {
    this.remove();
    this.run(this as never);
  }
}
