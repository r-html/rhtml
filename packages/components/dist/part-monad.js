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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_html_1 = require("@rxdi/lit-html");
const shades_1 = require("shades");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * @customElement r-part
 */
let MonadComponent = class MonadComponent extends lit_html_1.LitElement {
    OnUpdateFirst() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
            const renderComponent = this.findNode(nodes, 'r-render');
            const fetchComponent = this.findNode(nodes, 'r-fetch');
            const stateComponent = this.findNode(nodes, 'r-state');
            const settings = this.findNode(nodes, 'r-settings');
            const lensComponent = this.findNode(nodes, 'r-lens');
            const fetch = fetchComponent
                ? this.applyQueries(fetchComponent)
                : '';
            let state = stateComponent ? yield stateComponent.value : null;
            if (lensComponent) {
                state = this.applyLenses(state, lensComponent);
            }
            this.options = {
                state,
                fetch,
                render: renderComponent.state
            };
            this.options.settings = settings ? settings.value : null;
            fetchComponent
                ? (this.componentToRender = lit_html_1.html `
          <r-graph .options=${this.options}></r-graph>
        `)
                : (this.componentToRender = lit_html_1.html `
          <r-renderer .options=${this.options}></r-renderer>
        `);
        });
    }
    trim(query = '', type) {
        if (query.includes(type)) {
            return query;
        }
        const trimmedQuery = query.trim().replace(/\s/g, ' ');
        return `${type} ${trimmedQuery}`;
    }
    applyQueries(fetchComponent) {
        if (fetchComponent.query) {
            return this.trim(fetchComponent.query, 'query');
        }
        if (fetchComponent.subscribe) {
            return this.trim(fetchComponent.subscribe, 'subscription');
        }
        if (fetchComponent.mutate) {
            return this.trim(fetchComponent.mutate, 'mutation');
        }
        return '';
    }
    applyLenses(state = {}, lensComponent) {
        let newState = JSON.parse(JSON.stringify(state));
        if (lensComponent.match) {
            newState = this.get(newState, lensComponent.match);
        }
        else if (lensComponent.get) {
            lensComponent.get = lensComponent.get.map(a => (a === 'all' ? shades_1.all : a));
            if (rxjs_1.isObservable(newState)) {
                newState = newState.pipe(operators_1.map(s => {
                    const expectedState = shades_1.get(...lensComponent.get)(s);
                    if (!expectedState) {
                        return s;
                    }
                    return expectedState;
                }));
            }
            else {
                newState = shades_1.get(...lensComponent.get)(newState);
            }
            if (lensComponent.ray) {
                newState = lensComponent.ray(newState);
            }
        }
        else if (lensComponent.ray) {
            if (rxjs_1.isObservable(newState)) {
                newState = newState.pipe(operators_1.map(s => lensComponent.ray(s)));
            }
            else {
                newState = lensComponent.ray(newState);
            }
        }
        return newState;
    }
    modState(args, state) {
        return new Promise((resolve, reject) => {
            try {
                shades_1.mod(args[0], args[1], args[2], args[3], args[4])(resolve)(state);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    findNode(nodes, localName) {
        const node = nodes.find(n => n &&
            n.nextSibling &&
            n.nextSibling.localName === localName);
        return node ? node.nextSibling : null;
    }
    get(obj = {}, path = '', defaultValue) {
        return (path
            .replace(/\[(.+?)\]/g, '.$1')
            .split('.')
            .reduce((o, key) => o[key], obj) || defaultValue);
    }
};
__decorate([
    lit_html_1.property({ type: Object }),
    __metadata("design:type", Object)
], MonadComponent.prototype, "options", void 0);
MonadComponent = __decorate([
    lit_html_1.Component({
        selector: 'r-part',
        template() {
            return lit_html_1.html `
      <slot></slot>
      ${this.options ? this.componentToRender : ''}
    `;
        }
    })
], MonadComponent);
exports.MonadComponent = MonadComponent;
//# sourceMappingURL=part-monad.js.map