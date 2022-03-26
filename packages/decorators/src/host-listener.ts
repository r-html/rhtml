export const HostListener = (event: keyof DocumentEventMap) => (
  target: unknown,
  key: string,
  propertyDescriptor: PropertyDescriptor
) => {
  const wrapper = function(...args: unknown[]) {
    return propertyDescriptor.value.apply(this, args);
  };
  const OnInit =
    target['OnInit'] ||
    function() {
      /*  */
    };
  const OnDestroy =
    target['OnDestroy'] ||
    function() {
      /*  */
    };

  Object.defineProperty(target, 'OnInit', {
    value: function(...args: unknown[]) {
      const element = this.element ?? this;
      element.addEventListener(event, (...args: unknown[]) =>
        wrapper.apply(this, args)
      );
      return OnInit.apply(this, args);
    },
    configurable: true,
    writable: true
  });

  Object.defineProperty(target, 'OnDestroy', {
    value: function(...args: unknown[]) {
      const element = this.element ?? this;
      element.removeEventListener(event, (...args: unknown[]) =>
        wrapper.apply(this, args)
      );
      return OnDestroy.apply(this, args);
    },
    configurable: true,
    writable: true
  });
  return {
    get: () => wrapper
  };
};
