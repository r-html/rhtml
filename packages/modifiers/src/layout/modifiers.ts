export type FxLayout = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export type MainAxis =
  | 'start'
  | 'center'
  | 'end'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type CrossAxis =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'baseline';

export enum Attributes {
  FxLayout = 'fxLayout',
  FxFlex = 'fxFlex',
  FxFlexFill = 'fxFlexFill',
  FxLayoutAlign = 'fxLayoutAlign',
  FxLayoutGap = 'fxLayoutGap',
  FxFlexAlign = 'fxFlexAlign',
  FxFlexOffset = 'fxFlexOffset',
  FxFlexOrder = 'fxFlexOrder'
}
/* TODO we need to update to typescript 4 */
// export type FxLayoutAlign = `${MainAxis} ${CrossAxis}`;

export const isAttribute = (attr: string): boolean | string =>
  typeof attr === 'string' && (attr || attr === '');

export const setFxLayoutAlign = (element: HTMLElement) => {
  const fxLayoutAlign = element.getAttribute(Attributes.FxLayoutAlign);
  if (isAttribute(fxLayoutAlign)) {
    const [mainAxis, crossAxis] = fxLayoutAlign.split(' ');
    element.style['place-content'] = crossAxis
      ? `${crossAxis} ${mainAxis}`
      : `${mainAxis} ${mainAxis}`;
    element.style['align-items'] = crossAxis ? crossAxis : mainAxis;
  }
  element.style['display'] = 'flex';
};

export const setChildrensFlexFill = (div: HTMLElement): void => {
  const fxFlexFill = div.getAttribute(Attributes.FxFlexFill);
  if (isAttribute(fxFlexFill)) {
    div.style['margin'] = '0';
    div.style['width'] = '100%';
    div.style['height'] = '100%';
    div.style['min-width'] = '100%';
    div.style['min-height	'] = '100%';
  }
};

export const setChildrensFlex = (div: HTMLElement) => {
  const fxFlex = div.getAttribute(Attributes.FxFlex);
  if (isAttribute(fxFlex)) {
    div.style['flex'] = '1 1 100%';
    div.style['box-sizing'] = 'border-box';
    if (fxFlex) {
      div.style['max-width'] = fxFlex;
    }
  }
};

export const setFlexAlign = (div: HTMLElement) => {
  const fxFlexAlign = div.getAttribute(Attributes.FxFlexAlign);
  if (isAttribute(fxFlexAlign)) {
    div.style['align-self'] = fxFlexAlign;
  }
};

export const setFlexOffset = (div: HTMLElement) => {
  const fxFlexOffset = div.getAttribute(Attributes.FxFlexOffset);
  if (isAttribute(fxFlexOffset)) {
    div.style['margin-left'] = fxFlexOffset;
  }
};

export const setFlexOrder = (div: HTMLElement) => {
  const fxFlexOrder = div.getAttribute(Attributes.FxFlexOrder);
  if (isAttribute(fxFlexOrder)) {
    div.style['order'] = fxFlexOrder;
  } else {
    div.style['order'] = '0';
  }
};

export const subscribeToAttributeChanges = (name: string) => (
  fn: (element: HTMLElement) => void
) => (element: HTMLElement) => {
  fn(element);
  return new MutationObserver(() => fn(element)).observe(element, {
    attributeFilter: [name.toLocaleLowerCase()],
    attributes: true
  });
};

export const setFxLayout = (element: HTMLElement) => {
  const layout = element.getAttribute(Attributes.FxLayout);
  if (isAttribute(layout)) {
    const splitted = layout.split(' ');
    const [mainAxis, crossAxis] = splitted;
    element.style['flex-flow'] =
      splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis;
    element.style['box-sizing'] = 'flex';
    element.style['display'] = 'flex';
  }
};

export function recursion(div: HTMLElement) {
  const fxFlex = div.getAttribute(Attributes.FxFlex);
  const fxFlexFill = div.getAttribute(Attributes.FxFlexFill);
  const fxLayout = div.getAttribute(Attributes.FxLayout);
  const fxLayoutAlign = div.getAttribute(Attributes.FxLayoutAlign);
  const fxLayoutGap = div.getAttribute(Attributes.FxLayoutGap);
  const fxFlexAlign = div.getAttribute(Attributes.FxFlexAlign);
  const fxFlexOffset = div.getAttribute(Attributes.FxFlexOffset);
  const fxFlexOrder = div.getAttribute(Attributes.FxFlexOrder);

  if (isAttribute(fxFlexOrder)) {
    subscribeToAttributeChanges(Attributes.FxFlexOrder)(setFlexOrder)(div);
  }
  if (isAttribute(fxFlexOffset)) {
    subscribeToAttributeChanges(Attributes.FxFlexAlign)(setFlexOffset)(div);
  }

  if (isAttribute(fxFlexAlign)) {
    subscribeToAttributeChanges(Attributes.FxFlexAlign)(setFlexAlign)(div);
  }

  if (isAttribute(fxFlex)) {
    subscribeToAttributeChanges(Attributes.FxFlex)(setChildrensFlex)(div);
  }

  if (isAttribute(fxFlexFill)) {
    subscribeToAttributeChanges(Attributes.FxFlexFill)(setChildrensFlexFill)(
      div
    );
  }

  if (isAttribute(fxLayout)) {
    const observer = new MutationObserver(() => {
      observer.disconnect();
      recursion.call(this, div);
    });
    observer.observe(div, {
      subtree: true,
      childList: true
    });
    subscribeToAttributeChanges(Attributes.FxLayout)(setFxLayout)(div);
  }

  if (isAttribute(fxLayoutAlign)) {
    subscribeToAttributeChanges(Attributes.FxLayoutAlign)(setFxLayoutAlign)(
      div
    );
  }

  if (isAttribute(fxLayoutGap)) {
    const divs = [...div.children] as HTMLElement[];
    for (const div of divs) {
      div.style['margin'] = `0px ${fxLayoutGap} ${fxLayoutGap} 0px`;
      div.style.flex = '1 1 25%';
    }
  }

  const divs = [...div.children] as HTMLElement[];
  for (const div of divs) {
    recursion.call(this, div);
  }
}
