import { noop, observe } from '../helpers';
import { InputOptions, ModifierOptions } from '../types';

/**
 * Decorator @Input
 * Used to get attribute from element
 */
export const Input =
  (options?: InputOptions) => (target, memberName: string) => {
    const OnInit = target.OnInit || noop;
    Object.defineProperty(target, 'OnInit', {
      value() {
        let originalValue = this[memberName];

        const element = this.element ?? this;
        Object.defineProperty(this, memberName, {
          get: function () {
            originalValue = element.getAttribute(memberName.toLowerCase());
            return originalValue;
          },
          set(value) {
            element.setAttribute(memberName.toLowerCase(), value);
            originalValue = value;
          },
          configurable: true,
        });
        return OnInit.call(this);
      },
      configurable: true,
    });

    if (options?.observe) {
      observe(target, memberName);
    }
  };

/**
 * Decorator @Modifier
 * Accepts parameter options with selector and registry
 */
export const Modifier = (options: ModifierOptions) => {
  return (target) => {
    target['options'] = options;
  };
};

/**
 * Decorator @CustomAttribute
 * Accepts parameter options with selector and registry
 */
export const CustomAttribute = Modifier;
/**
 * Decorator @Directive
 * Accepts parameter options with selector and registry
 */
export const Directive = Modifier;
