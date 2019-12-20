"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
lit_html_1.Component({
    selector: 'r-template',
    template: () => lit_html_1.html `
    <slot></slot>
  `
})(class RTemplateOperator extends lit_html_1.LitElement {
    OnUpdate() {
        this.nodes = this.shadowRoot.querySelector('slot').assignedNodes();
    }
});
//# sourceMappingURL=r-template.js.map