export const isAttribute = (attr: string): boolean | string =>
  typeof attr === 'string' && (attr || attr === '');

export const subscribeToAttributeChanges = (name: string) => (
  fn: (element: HTMLElement) => void
) => (element: HTMLElement) => {
  fn(element);
  return new MutationObserver(() => fn(element)).observe(element, {
    attributeFilter: [name.toLocaleLowerCase()],
    attributes: true
  });
};
