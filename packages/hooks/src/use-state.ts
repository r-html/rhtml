import { getElementUpdateFn, registerHook } from './hooks-core';

const stateMap = new WeakMap<HTMLElement, Map<number, unknown>>();

const updateState = <T>(
  element: HTMLElement,
  hookID: number,
  elementUpdateFn: () => void,
  newValue: T
) => {
  const currentValue = stateMap.get(element).get(hookID);
  if (currentValue === newValue) {
    return;
  }
  stateMap.get(element).set(hookID, newValue);
  if (elementUpdateFn) {
    elementUpdateFn();
  }
};

export const useState = <T>(value: T) => {
  const [element, hookID] = registerHook();
  const elementUpdateFn = getElementUpdateFn();

  if (!stateMap.has(element)) {
    stateMap.set(element, new Map());
  }

  if (!stateMap.get(element).has(hookID)) {
    updateState(element, hookID, null, value);
  }

  return [
    stateMap.get(element).get(hookID),
    updateState.bind(null, element, hookID, elementUpdateFn),
  ];
};
