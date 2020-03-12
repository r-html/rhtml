import { Observable } from 'rxjs';

import { State } from './state';

export function useState<T>(
  state: T
): [Observable<T>, (data: T) => void, () => T] {
  const { state$, setState, getState } = new State(state);
  return [state$, setState, getState];
}
