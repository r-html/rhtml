"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GraphModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const graphql_client_1 = require("@rxdi/graphql-client");
const graph_component_1 = require("./graph.component");
const tokens_1 = require("./tokens");
let GraphModule = GraphModule_1 = class GraphModule {
    static forRoot(config, defaults = {}) {
        return {
            module: GraphModule_1,
            components: [graph_component_1.GraphComponent],
            providers: [{ provide: tokens_1.DEFAULTS, useValue: defaults }],
            frameworkImports: [graphql_client_1.GraphqlModule.forRoot(config)]
        };
    }
};
GraphModule = GraphModule_1 = __decorate([
    core_1.Module()
], GraphModule);
exports.GraphModule = GraphModule;
//# sourceMappingURL=graph.module.js.map