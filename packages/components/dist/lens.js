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
 * @customElement r-lens
 */
let LensComponent = class LensComponent extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.ray = (res) => res;
    }
};
__decorate([
    lit_html_1.property({ type: String }),
    __metadata("design:type", String)
], LensComponent.prototype, "match", void 0);
__decorate([
    lit_html_1.property({ type: Array }),
    __metadata("design:type", Array)
], LensComponent.prototype, "get", void 0);
__decorate([
    lit_html_1.property({ type: Object }),
    __metadata("design:type", Function)
], LensComponent.prototype, "ray", void 0);
LensComponent = __decorate([
    lit_html_1.Component({
        selector: 'r-lens'
    })
], LensComponent);
exports.LensComponent = LensComponent;
//# sourceMappingURL=lens.js.map