import { setConfig } from '@rhtml/graphql';
import { html } from '@rxdi/lit-html';

setConfig({
  config: {
    uri: 'https://countries.trevorblades.com/',
    /* wss://your-domain/subscriptions */
    pubsub: '',
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
});
