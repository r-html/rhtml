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
/**
 * @customElement r-if
 */
let IfOperator = class IfOperator extends lit_html_1.LitElement {
};
__decorate([
    lit_html_1.property({ type: Boolean }),
    __metadata("design:type", Boolean)
], IfOperator.prototype, "exp", void 0);
IfOperator = __decorate([
    lit_html_1.Component({
        selector: 'r-if',
        template() {
            return lit_html_1.html `
      ${this.exp
                ? lit_html_1.html `
            <slot></slot>
          `
                : ''}
    `;
        }
    })
], IfOperator);
exports.IfOperator = IfOperator;
//# sourceMappingURL=if.js.map