import {
  Component,
  html,
  LitElement,
  noChange,
  TemplateResult
} from '@rxdi/lit-html';
import { AsyncDirective } from '@rxdi/lit-html/dist/lit-html/async-directive';
import {
  AttributePart,
  directive
} from '@rxdi/lit-html/dist/lit-html/directive';

import { recursion } from './modifiers';

export class LayoutDirective extends AsyncDirective {
  render(): symbol {
    return noChange;
  }
  update(part: AttributePart): symbol {
    const divs = [...part.element.children] as HTMLElement[];
    for (const div of divs) {
      recursion(div);
    }
    return this.render();
  }
}

@Component({
  selector: 'flex-layout',
  template() {
    return html`
      <slot></slot>
    `;
  }
})
export class FlexLayout extends LitElement {
  OnUpdate(): void {
    const slot = this.shadowRoot.querySelector('slot');
    for (const div of [...slot?.assignedElements()]) {
      recursion(div as never);
    }
  }

  public static modifier(template: TemplateResult): TemplateResult {
    return html`
      <flex-layout>${template}</flex-layout>
    `;
  }
}

export const layout = directive(LayoutDirective)();
