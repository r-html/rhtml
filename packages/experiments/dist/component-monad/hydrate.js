"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
function Hydrate(template) {
    window.addEventListener('load', () => {
        const selector = `r-service-module-${Math.random()
            .toString(36)
            .substring(7)}`;
        const serviceModule = document.createElement(selector);
        lit_html_1.Component({ selector, template: () => template })(class extends lit_html_1.LitElement {
            OnUpdateFirst() {
                setTimeout(() => serviceModule.remove(), 0);
            }
        });
        document.body.append(serviceModule);
    });
}
exports.Hydrate = Hydrate;
//# sourceMappingURL=hydrate.js.map