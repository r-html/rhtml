"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("./interface");
function Hydrate(template) {
    return new Promise(resolve => {
        let registry = document.querySelector(interface_1.selector);
        if (registry) {
            registry.register(template);
            resolve(registry);
        }
        else {
            const handler = () => {
                registry = document.querySelector(interface_1.selector);
                registry.register(template);
                resolve(registry);
                window.removeEventListener(interface_1.RegistryReadyEvent, handler);
            };
            window.addEventListener(interface_1.RegistryReadyEvent, handler);
        }
    });
}
exports.Hydrate = Hydrate;
//# sourceMappingURL=hydrate.js.map