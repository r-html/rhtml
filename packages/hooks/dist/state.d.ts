import { Observable } from 'rxjs';
export declare class State<T> {
    private state;
    constructor(v: T);
    get state$(): Observable<T>;
    select: <K>(mapFn: (state: T) => K) => Observable<K>;
    setState: (data: T) => void;
    getState: () => T;
}
