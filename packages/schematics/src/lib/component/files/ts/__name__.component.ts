import {
  Component,
  DefineDependencies,
  Providers,
  Render,
  Settings,
  State,
} from "@rhtml/component";
import { has, get, Injectable, set  } from "@rhtml/di";

import { html, LitElement, css, property } from "@rxdi/lit-html";

@Injectable()
class <%= classify(name) %>Provider {}

set(<%= classify(name) %>Provider);

const Dependencies = DefineDependencies(<%= classify(name) %>Provider)({ get, has });

type State = {
  name: string;
};

/**
 * @customElement '<%= dasherize(name) %>-component'
 */
@Component<State, typeof Dependencies, <%= classify(name) %>Component>([
  Settings({
    selector: "<%= dasherize(name) %>-component",
    styles: [
      css`
      /* Your styles goes here */
      `,
    ]
  }),
  Providers(Dependencies),
  State(function(this, [<%= camelize(name) %>Provider]) {
    return ({ name: this.name });
  }),
  Render(
    ([<%= camelize(name) %>Provider]) =>
      function (this, { name }) {
        return html`${name}`;
      }
  ),
])
export class <%= classify(name) %>Component extends LitElement {
  @property({ type: String })
  name: string;
}
