"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
/**
 * @customElement r-component
 */
let RComponentOperator = class RComponentOperator extends lit_html_1.LitElement {
    OnUpdateFirst() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
            const selectorComponent = this.findNode(nodes, 'r-selector');
            const renderComponent = this.findNode(nodes, 'r-render');
            const propertiesComponent = this.findNode(nodes, 'r-props');
            if (propertiesComponent) {
                yield propertiesComponent.requestUpdate();
            }
            const selector = selectorComponent ? selectorComponent.innerHTML : null;
            if (!window.customElements.get(selector) && selector) {
                lit_html_1.Component({
                    selector,
                    template() {
                        return renderComponent
                            ? renderComponent.state(this, (state) => Object.assign(this, state))
                            : lit_html_1.html `
                Missing template
              `;
                    }
                })(class extends lit_html_1.LitElement {
                    constructor() {
                        super(...arguments);
                        this.loading = true;
                    }
                    static get properties() {
                        return Object.assign(Object.assign({}, propertiesComponent.props), { loading: { type: Boolean } });
                    }
                });
            }
            if (renderComponent) {
                renderComponent.remove();
            }
            if (selectorComponent) {
                selectorComponent.remove();
            }
            if (propertiesComponent) {
                propertiesComponent.remove();
            }
            const script = this.findNode(nodes, 'script');
            if (script) {
                yield window.customElements.whenDefined(selector);
                new Function(script.innerHTML).call(yield window.customElements.get(selector));
                script.remove();
            }
            this.remove();
        });
    }
    findNode(nodes, localName) {
        const node = nodes.find(n => n && n.nextSibling && n.nextSibling.localName === localName);
        return node ? node.nextSibling : null;
    }
};
RComponentOperator = __decorate([
    lit_html_1.Component({
        selector: 'r-component',
        template: () => lit_html_1.html `
    <slot></slot>
  `
    })
], RComponentOperator);
exports.RComponentOperator = RComponentOperator;
//# sourceMappingURL=r-component.js.map