import { LitElement, Component, html, property } from '@rxdi/lit-html';
import { FetchComponent } from './fetch';
import { RenderComponent } from './render';
import { StateComponent } from './state';
import { GraphOptions } from './types';
import { SettingsComponent } from './settings';
import { LensComponent } from './lens';
import { get, mod, all } from 'shades';
import { isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @customElement r-part
 */
@Component({
  selector: 'r-part',
  template(this: MonadComponent) {
    return html`
      <slot></slot>
      ${this.options
        ? html`
            <r-graph .options=${this.options}></r-graph>
          `
        : ''}
    `;
  }
})
export class MonadComponent extends LitElement {
  @property({ type: Object })
  private options: GraphOptions;

  @property()
  private fetchComponent: FetchComponent;

  async OnUpdateFirst() {
    const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
    const renderComponent = this.findNode(
      nodes,
      'r-render'
    ) as RenderComponent;
    this.fetchComponent = this.findNode(nodes, 'r-fetch') as FetchComponent;
    const stateComponent = this.findNode(nodes, 'r-state') as StateComponent;
    const settingsComponent = this.findNode(
      nodes,
      'r-settings'
    ) as SettingsComponent;
    let fetch: string;
    let state = await stateComponent.value;
    const lensComponent = this.findNode(nodes, 'r-lens') as LensComponent;
    if (lensComponent.match) {
      state = this.get(state, lensComponent.match);
    } else if (lensComponent.get) {
      lensComponent.get = lensComponent.get.map(a => a === 'all' ? all : a);
      if (isObservable(state)) {
        state = state.pipe(map(s => {
          const expectedState = (get as any)(...lensComponent.get)(s);
          if (!expectedState) {
            return s;
          }
          return expectedState;
        }));
      } else {
        state = (get as any)(...lensComponent.get)(state);
      }
      if (lensComponent.ray) {
        state = lensComponent.ray(state);
      }
    } else if (lensComponent.ray) {
      if (isObservable(state)) {
        state = state.pipe(map(s => lensComponent.ray(s)));
      } else {
        state = lensComponent.ray(state);
      }
    }

    if (this.fetchComponent.query) {
      fetch = this.trim(this.fetchComponent.query, 'query');
    }
    if (this.fetchComponent.subscribe) {
      fetch = this.trim(this.fetchComponent.subscribe, 'subscription');
    }
    if (this.fetchComponent.mutate) {
      fetch = this.trim(this.fetchComponent.mutate, 'mutation');
    }

    this.options = {
      settings: settingsComponent.value,
      state,
      fetch,
      render: renderComponent.state
    };
  }

  private trim(query = '', type: 'query' | 'mutation' | 'subscription') {
    if (query.includes(type)) {
      return query;
    }
    const trimmedQuery = query.trim().replace(/\s/g, '');
    return `${type} ${trimmedQuery}`;
  }

  // private modState(args: any[], state) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       mod(args[0], args[1], args[2], args[3], args[4])(resolve)(state);
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  private findNode(nodes: Node[], localName: string) {
    const node = nodes.find(
      n =>
        n &&
        n.nextSibling &&
        (n.nextSibling as HTMLElement).localName === localName
    );
    if (node) {
      return node.nextSibling;
    }
    return { value: null };
  }

  private get(obj = {}, path = '', defaultValue?) {
    return (
      path
        .replace(/\[(.+?)\]/g, '.$1')
        .split('.')
        .reduce((o, key) => o[key], obj) || defaultValue
    );
  }
}
