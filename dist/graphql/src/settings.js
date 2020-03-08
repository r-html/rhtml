"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
exports.GraphqlSettings = {
    config: {
        uri: 'https://countries.trevorblades.com/',
        pubsub: 'wss://pubsub.youvolio.com/subscriptions',
        onRequest() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Headers();
            });
        }
    },
    defaults: {
        error: e => {
            return lit_html_1.html `
        <p style="color: black">
          ${e}
        </p>
      `;
        },
        loading: () => {
            return lit_html_1.html `
        <div style="text-align: center;">
          <rx-loading palette="danger"></rx-loading>
        </div>
      `;
        }
    }
};
function setConfig(config) {
    return (exports.GraphqlSettings = config);
}
exports.setConfig = setConfig;
//# sourceMappingURL=settings.js.map