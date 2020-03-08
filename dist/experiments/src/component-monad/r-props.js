"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
/**
 * @customElement r-props
 */
let RPropsOperator = class RPropsOperator extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.props = {};
    }
    OnUpdateFirst() {
        this.nodes = this.querySelectorAll('r-prop');
        this.nodes.forEach(n => {
            const k = n.querySelector('r-key');
            const t = n.querySelector('r-type');
            const key = n['key'] || k.innerHTML;
            let type = n['type'] || t.innerHTML;
            if (this.isString(type)) {
                type = String;
            }
            if (this.isNumber(type)) {
                type = Number;
            }
            if (this.isBoolean(type)) {
                type = Boolean;
            }
            if (this.isObject(type)) {
                type = Object;
            }
            this.props[key] = { type };
        });
    }
    OnDestroy() {
        this.nodes.forEach(n => n.remove());
    }
    isString(value) {
        return value === 'String';
    }
    isNumber(value) {
        return value === 'Number';
    }
    isBoolean(value) {
        return value === 'Boolean';
    }
    isObject(value) {
        return value === 'Object';
    }
    castToType(value, type) { }
};
RPropsOperator = __decorate([
    lit_html_1.Component({
        selector: 'r-props',
        template: () => lit_html_1.html `
    <slot></slot>
  `
    })
], RPropsOperator);
exports.RPropsOperator = RPropsOperator;
//# sourceMappingURL=r-props.js.map