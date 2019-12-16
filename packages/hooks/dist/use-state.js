"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
function useState(state) {
    const { state$, setState, getState } = new state_1.State(state);
    return [state$, setState, getState];
}
exports.useState = useState;
//# sourceMappingURL=use-state.js.map