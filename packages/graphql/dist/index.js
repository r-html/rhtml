"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
const graph_module_1 = require("./graph.module");
const settings_1 = require("./settings");
let GraphqlModule = class GraphqlModule {
};
GraphqlModule = __decorate([
    core_1.Module({
        imports: [
            graph_module_1.GraphModule.forRoot(settings_1.GraphqlSettings.config, settings_1.GraphqlSettings.defaults)
        ]
    })
], GraphqlModule);
exports.GraphqlModule = GraphqlModule;
__export(require("./base.service"));
__export(require("./graph.component"));
//# sourceMappingURL=index.js.map