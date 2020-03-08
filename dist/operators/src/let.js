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
 * @customElement r-let
 */
let LetOperator = class LetOperator extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.data = [];
        this.item = (v) => lit_html_1.html `
      ${v}
    `;
    }
    normalizeArray(state) {
        if (!state || typeof state === 'string') {
            return [];
        }
        if (typeof state === 'number') {
            return Array.from(Array(state), (v, i) => i);
        }
        /* https://javascript.info/map-set */
        if (state instanceof Map || state instanceof Set) {
            return [...state.entries()];
        }
        if (!Array.isArray(state)) {
            return Object.entries(state);
        }
        return state;
    }
    isObservable(value) {
        return this.isFunction(value.lift) && this.isFunction(value.subscribe);
    }
    isFunction(value) {
        return typeof value === 'function';
    }
};
__decorate([
    lit_html_1.property({ type: Array }),
    __metadata("design:type", Object)
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
      ${this.isObservable(this.data)
                ? lit_html_1.html `
            <r-renderer
              .options=${{
                    state: this.data,
                    render: s => this.normalizeArray(s).map(this.item)
                }}
            ></r-renderer>
          `
                : this.normalizeArray(this.data).map(this.item)}
    `;
        }
    })
], LetOperator);
exports.LetOperator = LetOperator;
//# sourceMappingURL=let.js.map