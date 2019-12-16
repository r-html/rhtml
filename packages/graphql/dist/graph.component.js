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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const base_service_1 = require("./base.service");
const core_1 = require("@rxdi/core");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const tokens_1 = require("./tokens");
/**
 * @customElement r-graph
 */
let GraphComponent = class GraphComponent extends lit_html_1.LitElement {
    constructor() {
        super(...arguments);
        this.options = {
            fetch: '',
            state: new rxjs_1.BehaviorSubject({}),
            render: res => lit_html_1.html `
        ${res}
      `,
            loading: () => lit_html_1.html ``,
            error: () => lit_html_1.html ``,
            settings: {}
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
            }
            else {
                this.result.next(this.options.state);
            }
        }
        else {
            try {
                task = this.query();
            }
            catch (e) {
                this.result.error(e);
                this.result.complete();
            }
        }
        if (this.options.subscribe) {
            this.pubsubSubscription = this.graphql
                .subscribe({
                query: graphql_tag_1.default `
            ${this.options.subscribe}
          `
            })
                .subscribe(data => this.result.next(data), e => this.result.error(e));
        }
        if (!task) {
            return;
        }
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
    OnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.pubsubSubscription) {
            this.pubsubSubscription.unsubscribe();
        }
        this.result.complete();
    }
    query() {
        let fetch = this.options.fetch;
        this.options.settings = this.options.settings || {};
        this.options.fetch = this.options.fetch || '';
        if (this.options.fetch['loc'] && this.options.fetch['loc'].source) {
            fetch = this.options.fetch['loc'].source.body;
        }
        if (typeof fetch === 'string' && fetch.includes('mutation')) {
            this.options.settings.mutation = graphql_tag_1.default `
        ${fetch}
      `;
            return this.graphql.mutate(this.options.settings);
        }
        this.options.settings.query =
            typeof fetch !== 'string'
                ? fetch
                : graphql_tag_1.default `
            ${fetch}
          `;
        if (typeof fetch === 'string' && fetch.includes('subscription')) {
            return this.graphql.subscribe(this.options.settings);
        }
        return this.graphql.query(this.options.settings);
    }
    isPrimitive(test) {
        return test !== Object(test);
    }
};
__decorate([
    lit_html_1.property({ type: Object }),
    __metadata("design:type", Object)
], GraphComponent.prototype, "options", void 0);
__decorate([
    core_1.Inject(base_service_1.BaseService),
    __metadata("design:type", base_service_1.BaseService)
], GraphComponent.prototype, "graphql", void 0);
__decorate([
    lit_html_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], GraphComponent.prototype, "loading", void 0);
__decorate([
    lit_html_1.property({ type: String }),
    __metadata("design:type", Object)
], GraphComponent.prototype, "error", void 0);
GraphComponent = __decorate([
    lit_html_1.Component({
        selector: 'r-graph',
        template() {
            return lit_html_1.html `
      ${lit_html_1.async(this.result.pipe(operators_1.map(state => {
                return this.options.render
                    ? this.options.render(state, data => this.result.next(data))
                    : state;
            }), operators_1.tap(() => (this.loading = false)), operators_1.catchError(e => {
                this.error = e;
                this.loading = false;
                return rxjs_1.of('');
            })))}
      ${this.loading
                ? lit_html_1.html `
            ${typeof this.options.loading === 'function'
                    ? this.options.loading()
                    : core_1.Container.get(tokens_1.DEFAULTS).loading()}
          `
                : ''}
      ${this.error
                ? lit_html_1.html `
            ${typeof this.options.error === 'function'
                    ? this.options.error(this.error)
                    : core_1.Container.get(tokens_1.DEFAULTS).error(this.error)}
          `
                : ''}
      <slot></slot>
    `;
        }
    })
], GraphComponent);
exports.GraphComponent = GraphComponent;
//# sourceMappingURL=graph.component.js.map