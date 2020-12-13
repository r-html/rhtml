import {
  Component,
  html,
  LitElement,
  property,
  TemplateResult
} from '@rxdi/lit-html';
import { map } from 'rxjs/operators';
import { all, get, mod } from 'shades';

import { FetchComponent } from './fetch';
import { LensComponent } from './lens';
import { RenderComponent } from './render';
import { SettingsComponent } from './settings';
import { StateComponent } from './state';
import { StyleComponent } from './style';
import { GraphOptions } from './types';

function isObservable(obj) {
  return typeof obj.lift === 'function' && typeof obj.subscribe === 'function';
}

/**
 * @customElement r-part
 */
@Component({
  selector: 'r-part',
  template(this: MonadComponent) {
    return html`
      <slot></slot>
      ${this.options ? this.componentToRender : ''}
    `;
  }
})
export class MonadComponent extends LitElement {
  @property({ type: Object })
  private options: GraphOptions;

  private componentToRender: TemplateResult;

  async OnUpdateFirst() {
    const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
    const renderComponent = this.findNode(nodes, 'r-render') as RenderComponent;
    const fetchComponent = this.findNode(nodes, 'r-fetch') as FetchComponent;
    const stateComponent = this.findNode(nodes, 'r-state') as StateComponent;
    const settings = this.findNode(nodes, 'r-settings') as SettingsComponent;
    const lensComponent = this.findNode(nodes, 'r-lens') as LensComponent;
    const styleComponent = this.findNode<StyleComponent>(nodes, 'r-style');

    const script = this.findNode(nodes, 'script') as HTMLScriptElement;
    if (script) {
      new Function(script.innerHTML).call(this);
    }
    const fetch: string = fetchComponent
      ? this.applyQueries(fetchComponent)
      : '';

    let state = stateComponent ? await stateComponent.value : null;

    if (lensComponent) {
      state = this.applyLenses(state, lensComponent);
    }
    this.options = {
      state,
      fetch,
      style: styleComponent?.value,
      render: renderComponent.state
    };
    this.options.settings = settings ? settings.value : null;

    fetchComponent
      ? (this.componentToRender = html`
          <r-graph .options=${this.options}></r-graph>
        `)
      : (this.componentToRender = html`
          <r-renderer .options=${this.options}></r-renderer>
        `);
  }

  private trim(query = '', type: 'query' | 'mutation' | 'subscription') {
    if (query.includes(type)) {
      return query;
    }
    const trimmedQuery = query.trim().replace(/\s/g, ' ');
    return `${type} ${trimmedQuery}`;
  }

  private applyQueries(fetchComponent: FetchComponent) {
    if (fetchComponent.query) {
      return this.trim(fetchComponent.query, 'query');
    }
    if (fetchComponent.subscribe) {
      return this.trim(fetchComponent.subscribe, 'subscription');
    }
    if (fetchComponent.mutate) {
      return this.trim(fetchComponent.mutate, 'mutation');
    }
    return '';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyLenses(state: any = {}, lensComponent: LensComponent) {
    let newState = JSON.parse(JSON.stringify(state));
    if (lensComponent.match) {
      newState = this.get(newState, lensComponent.match);
    } else if (lensComponent.get) {
      lensComponent.get = lensComponent.get.map(a => (a === 'all' ? all : a));
      if (isObservable(newState)) {
        newState = newState.pipe(
          map(s => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expectedState = (get as any)(...lensComponent.get)(s);
            if (!expectedState) {
              return s;
            }
            return expectedState;
          })
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newState = (get as any)(...lensComponent.get)(newState);
      }
      if (lensComponent.ray) {
        newState = lensComponent.ray(newState);
      }
    } else if (lensComponent.ray) {
      if (isObservable(newState)) {
        newState = newState.pipe(map(s => lensComponent.ray(s)));
      } else {
        newState = lensComponent.ray(newState);
      }
    }
    return newState;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private modState(args: any[], state) {
    return new Promise((resolve, reject) => {
      try {
        mod(args[0], args[1], args[2], args[3], args[4])(resolve)(state);
      } catch (e) {
        reject(e);
      }
    });
  }

  private findNode<T>(nodes: Node[], localName: string): T | null {
    const node = nodes.find(
      n =>
        n &&
        n.nextSibling &&
        (n.nextSibling as HTMLElement).localName === localName
    );
    return (node ? node.nextSibling : null) as never;
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
