"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class State {
    constructor(v) {
        this.select = (mapFn) => {
            return this.state.pipe(operators_1.map(mapFn));
        };
        this.setState = (data) => {
            this.state.next(Object.assign(Object.assign({}, this.state.getValue()), data));
        };
        this.getState = () => {
            return this.state.getValue();
        };
        this.state = new rxjs_1.BehaviorSubject(v || {});
    }
    get state$() {
        return this.state.asObservable();
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map