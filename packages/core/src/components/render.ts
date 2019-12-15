import {
  LitElement,
  Component,
  property,
  TemplateResult,
  html
} from '@rxdi/lit-html';

/**
 * @customElement rx-render
 */
@Component({
  selector: 'rx-render',
  template: () => html`
    <slot></slot>
  `
})
export class RenderComponent extends LitElement {
  @property({ type: Object }) state: <T>(
    state: T,
    setState?: (res: T) => void
  ) => TemplateResult;
}
