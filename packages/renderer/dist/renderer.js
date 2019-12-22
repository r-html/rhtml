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
function Render(config) {
    return function (cls) {
        if (!window.customElements.get(config.selector)) {
            return lit_html_1.Component(config)(cls);
        }
    };
}
/**
 * @customElement r-renderer
 */
let Renderer = class Renderer extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.options = {
            state: {},
            render: res => lit_html_1.html `
        ${res}
      `,
            loading: () => lit_html_1.html ``,
            error: () => lit_html_1.html ``
        };
        this.loading = true;
        this.error = '';
        this.state = {};
    }
    OnUpdateFirst() {
        if (this.options.state) {
            if (this.isObservable(this.options.state)) {
                this.subscription = this.options.state.subscribe(detail => {
                    this.state = detail;
                    this.loading = false;
                    this.dispatchEvent(new CustomEvent('onData', { detail }));
                }, error => {
                    this.state = {};
                    this.error = error;
                    this.loading = false;
                    this.dispatchEvent(new CustomEvent('onError', { detail: error }));
                });
            }
            else {
                this.loading = false;
                this.state = this.options.state;
            }
        }
    }
    isObservable(value) {
        return this.isFunction(value.lift) && this.isFunction(value.subscribe);
    }
    isFunction(value) {
        return typeof value === 'function';
    }
    OnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
__decorate([
    lit_html_1.property(),
    __metadata("design:type", Object)
], Renderer.prototype, "options", void 0);
__decorate([
    lit_html_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], Renderer.prototype, "loading", void 0);
__decorate([
    lit_html_1.property({ type: String }),
    __metadata("design:type", Object)
], Renderer.prototype, "error", void 0);
__decorate([
    lit_html_1.property(),
    __metadata("design:type", Object)
], Renderer.prototype, "state", void 0);
Renderer = __decorate([
    Render({
        selector: 'r-renderer',
        template() {
            return lit_html_1.html `
      ${!this.loading
                ? this.options.render
                    ? this.options.render(this.state, s => (this.state = s))
                    : this.state
                : ''}
      ${this.loading
                ? lit_html_1.html `
            ${this.isFunction(this.options.error)
                    ? this.options.loading()
                    : lit_html_1.html ``}
          `
                : ''}
      ${this.error
                ? lit_html_1.html `
            ${this.isFunction(this.options.error)
                    ? this.options.error(this.error)
                    : lit_html_1.html `
                  ${this.error}
                `}
          `
                : ''}
    `;
        }
    })
], Renderer);
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map