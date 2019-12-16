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
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
/**
 * @customElement r-renderer
 */
let Renderer = class Renderer extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.options = {
            state: new rxjs_1.BehaviorSubject({}),
            render: function (res) {
                return lit_html_1.html `
        ${res}
      `;
            },
            loading: () => lit_html_1.html ``,
            error: () => lit_html_1.html ``
        };
        this.loading = true;
        this.error = '';
        this.result = new rxjs_1.ReplaySubject();
    }
    OnUpdateFirst() {
        let task;
        if (this.options.state) {
            if (rxjs_1.isObservable(this.options.state)) {
                task = this.options.state;
                this.subscription = task.subscribe(detail => {
                    this.result.next(detail);
                    this.dispatchEvent(new CustomEvent('onData', { detail }));
                }, error => {
                    if (error.networkError) {
                        error.message = `${JSON.stringify(error.networkError.result.errors)} ${error.message}`;
                    }
                    this.result.error(error);
                    this.dispatchEvent(new CustomEvent('onError', { detail: error }));
                });
            }
            else {
                this.result.next(this.options.state);
            }
        }
    }
    OnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.result.complete();
    }
};
__decorate([
    lit_html_1.property({ type: Object }),
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
Renderer = __decorate([
    lit_html_1.Component({
        selector: 'r-renderer',
        template() {
            return lit_html_1.html `
      ${lit_html_1.async(this.result.pipe(operators_1.map(state => this.options.render
                ? this.options.render(state, data => this.result.next(data))
                : state), operators_1.tap(() => (this.loading = false)), operators_1.catchError(e => {
                this.error = e;
                this.loading = false;
                return rxjs_1.of('');
            })))}
      ${this.loading
                ? lit_html_1.html `
            ${typeof this.options.loading === 'function'
                    ? this.options.loading()
                    : lit_html_1.html `
                  Default
                `}
          `
                : ''}
      ${this.error
                ? lit_html_1.html `
            ${typeof this.options.error === 'function'
                    ? this.options.error(this.error)
                    : lit_html_1.html `
                  Default ${this.error}
                `}
          `
                : ''}
      <slot></slot>
    `;
        }
    })
], Renderer);
exports.Renderer = Renderer;
//# sourceMappingURL=renderer.js.map