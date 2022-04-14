export interface HookState {
  element: HTMLElement;
  renderIsInProgress: boolean;
  hooksExecutedThisRender: number;
  elementUpdateFn: () => void;
}

let hooksState: HookState;

const OnRender = (element: HTMLElement, elementUpdateFn: () => void) => {
  hooksState = {
    element,
    renderIsInProgress: true,
    hooksExecutedThisRender: 0,
    elementUpdateFn,
  };
};

const OnEndRender = () => {
  hooksState = {
    element: null,
    renderIsInProgress: false,
    hooksExecutedThisRender: 0,
    elementUpdateFn: null,
  };
};

export const renderWithHooks = (
  element: HTMLElement,
  templateFn: (element: HTMLElement) => unknown,
  elementUpdateFn: () => void
) => {
  OnRender(element, elementUpdateFn);
  const template = templateFn(element);
  OnEndRender();
  return template;
};

export const getCurrentElement = () => hooksState.element;

export const getElementUpdateFn = () => hooksState.elementUpdateFn;

export const registerHook = (name?: string): [HTMLElement, number] => {
  if (!hooksState.renderIsInProgress) {
    throw new Error(
      `Hooks must be called from within an element's render() method. ${name} was not.`
    );
  }
  const hookId = hooksState.hooksExecutedThisRender++;
  return [hooksState.element, hookId];
};
