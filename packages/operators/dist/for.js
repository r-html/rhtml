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
const rxjs_1 = require("rxjs");
let ForOperator = class ForOperator extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.of = rxjs_1.of([]);
    }
    OnUpdate() {
        const slotNodes = this.shadowRoot.querySelector('slot').assignedNodes();
        if (slotNodes.length) {
            const slotNode = slotNodes[0];
            const letOperator = slotNode.nextSibling;
            if (letOperator) {
                if (rxjs_1.isObservable(this.of)) {
                    letOperator.data = this.of;
                }
                else {
                    letOperator.data = rxjs_1.of(this.of);
                }
            }
        }
    }
};
__decorate([
    lit_html_1.property({ type: Array }),
    __metadata("design:type", Object)
], ForOperator.prototype, "of", void 0);
ForOperator = __decorate([
    lit_html_1.Component({
        selector: 'r-for',
        template() {
            return lit_html_1.html `
      <slot></slot>
    `;
        }
    })
], ForOperator);
exports.ForOperator = ForOperator;
//# sourceMappingURL=for.js.map