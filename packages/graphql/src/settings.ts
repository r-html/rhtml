import { GraphqlModuleConfig } from '@rxdi/graphql-client';
import { html } from '@rxdi/lit-html';

import { DEFAULTS } from './tokens';

export interface GraphqlSettings {
  config: GraphqlModuleConfig;
  defaults: DEFAULTS;
}

export const GraphqlSettings: GraphqlSettings = {
  config: {
    uri: 'https://countries.trevorblades.com/',
    pubsub: 'wss://pubsub.youvolio.com/subscriptions',
    async onRequest() {
      return new Headers();
    }
  },
  defaults: {
    error: e => {
      return html`
        <p style="color: black">
          ${e}
        </p>
      `;
    },
    loading: () => {
      return html`
        <div style="text-align: center;">
          <rx-loading palette="danger"></rx-loading>
        </div>
      `;
    }
  }
};
