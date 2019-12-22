"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
const interface_1 = require("./interface");
/**
 * @customElement r-component-register
 */
let ComponentRegister = class ComponentRegister extends lit_html_1.LitElement {
    /**
     * @customElement r-component-register
     */
    constructor() {
        super(...arguments);
        this.components = [];
    }
    OnInit() {
        window.dispatchEvent(new Event(interface_1.RegistryReadyEvent));
    }
    register(template) {
        this.components = [...this.components, template];
    }
};
__decorate([
    lit_html_1.property({ type: Array }),
    __metadata("design:type", Object)
], ComponentRegister.prototype, "components", void 0);
ComponentRegister = __decorate([
    lit_html_1.Component({
        selector: interface_1.selector,
        template() {
            return lit_html_1.html `
      <r-for .of=${this.components}>
        <r-let .item=${i => i}></r-let>
      </r-for>
    `;
        }
    })
], ComponentRegister);
exports.ComponentRegister = ComponentRegister;
window.addEventListener('load', () => document.body.append(document.createElement(interface_1.selector)));
//# sourceMappingURL=component-registry.js.map