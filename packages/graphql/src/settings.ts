
import { GraphqlModuleConfig } from '@rxdi/graphql-client';
import { DEFAULTS } from './tokens';
import { html } from '@rxdi/lit-html';

export const GraphqlSettings: { config: GraphqlModuleConfig; defaults: DEFAULTS; } = {
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
