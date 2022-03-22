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
/* TODO we need to update to typescript 4 */
// export type FxLayoutAlign = `${MainAxis} ${CrossAxis}`;

export const isAttribute = (attr: string): boolean | string =>
  typeof attr === 'string' && (attr || attr === '');

export const setFxLayoutAlign = (element: HTMLElement) => {
  return (fxLayoutAlign = ''): void => {
    const [mainAxis, crossAxis] = fxLayoutAlign.split(' ');
    element.style['place-content'] = `${crossAxis} ${mainAxis}`;
    element.style['align-items'] = crossAxis;
    element.style['display'] = 'flex';
  };
};

export const setChildrensFlexFill = (div: HTMLElement): void => {
  div.style['margin'] = '0';
  div.style['width'] = '100%';
  div.style['height'] = '100%';
  div.style['min-width'] = '100%';
  div.style['min-height	'] = '100%';
};

export const setChildrensFlex = (div: HTMLElement) => {
  return (fxFlex: string): void => {
    div.style['flex'] = '1 1 100%';
    div.style['box-sizing'] = 'border-box';
    if (fxFlex) {
      div.style['max-width'] = fxFlex;
    }
  };
};

export const setFxLayout = (element: HTMLElement) => {
  return (fxLayout = 'row'): void => {
    // element.style['flex-direction'] = fxLayout;
    const splitted = fxLayout.split(' ');
    const [mainAxis, crossAxis] = splitted;

    element.style['box-sizing'] = 'flex';
    element.style['display'] = 'flex';
    element.style['flex-flow'] =
      splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis;
  };
};

export const recursion = (div: HTMLElement): void => {
  const fxFlex = div.getAttribute('fxFlex');
  const fxFlexFill = div.getAttribute('fxFlexFill');
  const fxLayout = div.getAttribute('fxLayout');
  const fxLayoutAlign = div.getAttribute('fxLayoutAlign');
  const fxLayoutGap = div.getAttribute('fxLayoutGap');

  if (isAttribute(fxFlex)) {
    setChildrensFlex(div)(fxFlex);
  }

  if (isAttribute(fxFlexFill)) {
    setChildrensFlexFill(div);
  }

  if (isAttribute(fxLayout)) {
    setFxLayout(div)(fxLayout);
  }

  if (isAttribute(fxLayoutAlign)) {
    setFxLayoutAlign(div)(fxLayoutAlign);
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
    recursion(div);
  }
};
