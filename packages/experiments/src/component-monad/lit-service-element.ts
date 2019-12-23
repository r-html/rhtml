import { LitElement, property } from '@rxdi/lit-html';

export class LitServiceElement<T = {}> extends LitElement {
  @property({ type: Object })
  run: (self: T) => void = () => null;

  OnUpdateFirst() {
    this.remove();
    this.run(this as any);
  }
}
