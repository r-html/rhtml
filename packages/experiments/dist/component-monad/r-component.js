"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
let RComponentOperator = class RComponentOperator extends lit_html_1.LitElement {
    OnUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
            const selectorComponent = this.findNode(nodes, 'r-selector');
            const templateComponent = this.findNode(nodes, 'r-template');
            const propertiesComponent = this.findNode(nodes, 'r-props');
            if (propertiesComponent) {
                yield propertiesComponent.requestUpdate();
            }
            if (templateComponent) {
                yield templateComponent.requestUpdate();
            }
            const selector = selectorComponent
                ? selectorComponent.getAttribute('value')
                : null;
            const templateNodes = templateComponent ? templateComponent.nodes : [];
            const template = document.createElement('div');
            templateNodes.forEach(node => template.appendChild(node));
            if (!window.customElements.get(selector)) {
                lit_html_1.Component({
                    selector
                })(class extends lit_html_1.LitElement {
                    static get properties() {
                        return propertiesComponent.props;
                    }
                    OnUpdate() {
                        function interpolate(string) {
                            const regexes = [/{(.*?)}/g];
                            return string.replace(regexes[0], match => match
                                .slice(2, -1)
                                .trim()
                                .split('.')
                                .reduce((el, k) => String(el[k]), this));
                        }
                        template.innerHTML = interpolate.call(this, template.innerHTML.trim());
                        this.shadowRoot.appendChild(template);
                    }
                });
            }
            if (templateComponent) {
                templateComponent.remove();
            }
            if (selectorComponent) {
                selectorComponent.remove();
            }
            if (propertiesComponent) {
                propertiesComponent.remove();
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