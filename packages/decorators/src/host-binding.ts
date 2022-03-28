// type Class = 'class';
// type Style = 'style';
// type Type = Style | Class;

// type Styles = keyof CSSStyleDeclaration;

// type Binding<T = Type> = T extends Style ? `${T}.${Styles}` : `${Class}.${string}`;

export const HostBinding = <T>(binding: string /* Binding<T> */) => (
  target,
  memberName: string
) => {
  const [type, key] = binding.split('.');

  const OnInit =
    target['OnInit'] ||
    function() {
      /*  */
    };
  const apply = (value: string) => (element: HTMLElement) => {
    if (type === 'style') {
      if (!value) {
        element.style[key] = null;
      } else {
        element.style[key] = value;
      }
    }
    if (type === 'class') {
      if (!value) {
        element.classList.remove(key);
      } else {
        element.classList.add(key);
      }
    }
  };

  Object.defineProperty(target, 'OnInit', {
    value: function(...args: unknown[]) {
      let currentValue: string = this[memberName];
      const element: HTMLElement = this.element ?? this;

      Object.defineProperty(target, memberName, {
        get: function() {
          return currentValue;
        },
        set: function(value) {
          apply(value)(element);
          currentValue = value;
        },
        configurable: true
      });
      if (currentValue) {
        apply(currentValue)(element);
      }
      return OnInit.apply(this, args);
    },
    configurable: true,
    writable: true
  });
};
