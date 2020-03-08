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
const core_1 = require("@rxdi/core");
const graphql_client_1 = require("@rxdi/graphql-client");
const rxjs_1 = require("rxjs");
let BaseService = class BaseService {
    query(options) {
        return rxjs_1.from(this.graphql.query.bind(this.graphql)(options));
    }
    mutate(options) {
        return rxjs_1.from(this.graphql.mutate.bind(this.graphql)(options));
    }
    watchQuery(options) {
        return this.graphql.watchQuery(options);
    }
    subscribe(options) {
        return rxjs_1.from(this.graphql.subscribe.bind(this.graphql)(options));
    }
};
__decorate([
    core_1.Injector(graphql_client_1.ApolloClient),
    __metadata("design:type", Object)
], BaseService.prototype, "graphql", void 0);
BaseService = __decorate([
    core_1.Injectable()
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map