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
const operators_1 = require("rxjs/operators");
let LetOperator = class LetOperator extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.data = rxjs_1.of([]);
        this.item = (v) => lit_html_1.html `
      ${v}
    `;
    }
};
__decorate([
    lit_html_1.property({ attribute: false }),
    __metadata("design:type", rxjs_1.Observable)
], LetOperator.prototype, "data", void 0);
__decorate([
    lit_html_1.property(),
    __metadata("design:type", Object)
], LetOperator.prototype, "item", void 0);
LetOperator = __decorate([
    lit_html_1.Component({
        selector: 'r-let',
        template() {
            return lit_html_1.html `
      ${lit_html_1.async(this.data.pipe(operators_1.map(v => v.map((element, index, array) => lit_html_1.html `
                  ${this.item(element, index, array)}
                `))))}
    `;
        }
    })
], LetOperator);
exports.LetOperator = LetOperator;
//# sourceMappingURL=let.js.map