import {
  Component,
  html,
  LitElement,
  property,
  TemplateResult
} from '@rxdi/lit-html';

/**
 * @customElement r-render
 */
@Component({
  selector: 'r-render',
  template: () => html`
    <slot></slot>
  `
})
export class RenderComponent extends LitElement {
  @property({ type: Object }) state: <T>(
    state: T,
    setState?: (res: T) => void,
    shadowRoot?: ShadowRoot
  ) => TemplateResult;
}
