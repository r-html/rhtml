import { Observable } from 'rxjs';
export declare function useState<T>(state: T): [Observable<T>, (data: T) => void, () => T];
