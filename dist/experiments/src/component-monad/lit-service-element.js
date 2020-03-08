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
class LitServiceElement extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.run = () => null;
    }
    OnUpdateFirst() {
        this.remove();
        this.run(this);
    }
}
__decorate([
    lit_html_1.property({ type: Object }),
    __metadata("design:type", Function)
], LitServiceElement.prototype, "run", void 0);
exports.LitServiceElement = LitServiceElement;
//# sourceMappingURL=lit-service-element.js.map