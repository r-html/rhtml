export type C<T> = new (...args: never[]) => T;

export interface Constructor<T> extends C<T> {
  options: ModifierOptions;
}

const noop = function() {
  /*  */
};

interface ModifierOptions {
  selector: string;
  registry?(this: HTMLElement): CustomAttributeRegistry;
  observedAttributes?: string[];
}

interface InputOptions {
  /**
   * If enabled will trigger OnUpdate method on the Attribute
   * */
  observe: true;
}

const observe = (target: unknown, memberName: string) => {
  const prototype = target.constructor.prototype;
  const OnInit = prototype.OnInit || noop;
  const OnDestroy = prototype.OnDestroy || noop;
  const OnUpdateAttribute = prototype.OnUpdateAttribute || noop;

  let observer: MutationObserver;
  prototype.OnInit = function() {
    const element = this.element ?? this;
    if (observer) {
      observer.disconnect();
    }
    observer = new MutationObserver(() => {
      OnUpdateAttribute.call(
        this,
        memberName,
        element.getAttribute(memberName)
      );
      target[memberName] = element.getAttribute(memberName);
    });
    observer.observe(element, {
      attributeFilter: [memberName],
      attributes: true
    });
    return OnInit.call(this);
  };
  prototype.OnDestroy = function() {
    observer.disconnect();
    return OnDestroy.call(this);
  };
};

/**
 * Decorator @Input
 * Used to get attribute from element
 */
export const Input = (options?: InputOptions) => (
  target,
  memberName: string
) => {
  const OnInit = target.OnInit || noop;
  Object.defineProperty(target, 'OnInit', {
    value() {
      let originalValue = this[memberName];

      const element = this.element ?? this;
      Object.defineProperty(this, memberName, {
        get: function() {
          originalValue = element.getAttribute(memberName.toLowerCase());
          return originalValue;
        },
        set(value) {
          element.setAttribute(memberName.toLowerCase(), value);
          originalValue = value;
        },
        configurable: true
      });
      return OnInit.call(this);
    },
    configurable: true
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
  return (target: Function) => {
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

/*  */
export abstract class Attribute<T = {}> {
  public static options: ModifierOptions;
  public element?: HTMLElement;
  public value?: string;
  public selector?: string;
  public parent?: HTMLElement;
  setStyles(keys: T) {
    return (div: HTMLElement | Element | HTMLDivElement) => {
      for (const [key, value] of Object.entries(keys)) {
        div['style'][key] = value;
      }
    };
  }
  OnInit(): void {
    /* */
  }
  OnDestroy(): void {
    /* */
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OnUpdate(_oldValue: string, _newValue: string) {
    /* */
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OnUpdateAttribute(_name: string, _value: string) {
    /* */
  }
}

/**
 * Media query Attribute
 * for performance reasons it is key value pair
 */
export const MediaMatchers = new Map([
  ['screen and (max-width: 599px)', 'xs'],
  ['screen and (min-width: 600px) and (max-width: 959px)', 'sm'],
  ['screen and (min-width: 960px) and (max-width: 1279px)', 'md'],
  ['screen and (min-width: 1280px) and (max-width: 1919px)', 'lg'],
  ['screen and (min-width: 1920px) and (max-width: 5000px)', 'xl'],
  ['screen and (max-width: 959px)', 'lt-md'],
  ['screen and (max-width: 1279px)', 'lt-lg'],
  ['screen and (max-width: 1919px)', 'lt-xl'],
  ['screen and (min-width: 600px)', 'gt-xs'],
  ['screen and (min-width: 960px)', 'gt-sm'],
  ['screen and (min-width: 1280px)', 'gt-md'],
  ['screen and (min-width: 1920px)', 'gt-lg']
]);
type MediaEvent = MediaQueryList | MediaQueryListEvent;
export type EnterMediaQueryAttributes = [MediaEvent, Attr];
export type ExitMediaQueryAttributes = [MediaEvent, string];

export interface OnUpdateMediaQuery {
  OnEnterMediaQuery(tuple: [MediaEvent, Attr]): void;
  OnExitMediaQuery(tuple: [MediaEvent, string]): void;
}

export const Breakpoints = [...MediaMatchers.values()];

export const createFiltersFromSelector = (selector: string) => [
  ...Breakpoints.map(breakpoint => `${selector}.${breakpoint}`),
  selector
];

export abstract class MediaQueryAttribute<T> extends Attribute<T>
  implements OnUpdateMediaQuery {
  prevValue: string;
  originalValue: string;

  private matchers: Map<MediaQueryList, MediaQueryList> = new Map();
  private cachedAttributes: Map<string, Attr> = new Map();

  listener = (event: MediaQueryList | MediaQueryListEvent) => {
    const key = `${this.selector.toLowerCase()}.${MediaMatchers.get(
      event.media
    )}`;
    const attribute = this.cachedAttributes.get(key);

    if (event.matches && attribute) {
      return this.OnEnterMediaQuery([event, attribute]);
    }
    return this.OnExitMediaQuery([event, key]);
  };

  OnInit() {
    if (this.OnEnterMediaQuery || this.OnExitMediaQuery) {
      this.originalValue = this.value;
      for (const query of MediaMatchers.keys()) {
        const matcher = window.matchMedia(query);

        const attr = Object.values(this.element.attributes).find(
          v =>
            v.name ===
            `${this.selector.toLowerCase()}.${MediaMatchers.get(query)}`
        );

        if (attr) {
          this.cachedAttributes.set(attr.name, attr);
          matcher.addEventListener('change', this.listener);
        }

        if (attr && matcher.matches) {
          this.listener(matcher);
        }
        this.matchers.set(matcher, matcher);
      }
    }
  }

  OnDestroy() {
    for (const matcher of this.matchers.values()) {
      matcher.removeEventListener('change', this.listener);
    }
    this.cachedAttributes.clear();
    this.matchers.clear();
  }

  abstract OnEnterMediaQuery(tuple: [MediaEvent, Attr]): void;
  abstract OnExitMediaQuery(tuple: [MediaEvent, string]): void;
}

/* Media query Attribute  END */

export class CustomAttributeRegistry {
  private _attrMap: Map<string, Constructor<Attribute>> = new Map();
  private _elementMap: Map<HTMLElement, Map<string, Attribute>> = new Map();
  private observer: MutationObserver;

  constructor(private parent: HTMLElement) {
    if (!parent) {
      throw new Error('Must be given a parent element');
    }
    this.observe();
  }

  define(attrName: string, Constructor: Constructor<Attribute>) {
    this._attrMap.set(attrName.toLowerCase(), Constructor);
    this.upgradeAttribute(attrName);
  }

  get(element: HTMLElement, attrName: string) {
    const map = this._elementMap.get(element);
    if (!map) return;
    return map.get(attrName.toLowerCase());
  }

  private getConstructor(attrName: string) {
    return this._attrMap.get(attrName.toLowerCase());
  }

  private observe() {
    this.observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const attr = this.getConstructor(mutation.attributeName);
          if (attr) {
            this.found(
              mutation.attributeName,
              mutation.target as never,
              mutation.oldValue
            );
          }
        } else {
          for (const node of mutation.removedNodes) {
            this.downgrade(node as never);
          }
          for (const node of mutation.addedNodes) {
            this.upgradeElement(node as never);
          }
        }
      }
    });
    this.observer.observe(this.parent?.['shadowRoot'] ?? this.parent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
  }

  unsubscribe() {
    this.observer?.disconnect();
    const values = [...this._elementMap.values()];
    for (const elModifiers of values) {
      const modifiers = [...elModifiers.values()];
      for (const modifier of modifiers) {
        modifier.OnDestroy();
      }
      elModifiers.clear();
    }
    this._elementMap.clear();
  }

  private upgradeAttribute(attrName: string, doc?: HTMLElement) {
    const parent = doc || this.parent;

    const matches = parent.querySelectorAll('[' + attrName + ']');

    for (const match of [...matches]) {
      this.found(attrName, match as never);
    }
  }

  private upgradeElement(element: HTMLElement) {
    if (element.nodeType !== 1) {
      return;
    }
    for (const attr of element.attributes) {
      if (this.getConstructor(attr.name)) {
        this.found(attr.name, element);
      }
    }
    for (const [attr] of this._attrMap) {
      this.upgradeAttribute(attr, element);
    }
  }

  private downgrade(element: HTMLElement) {
    const map = this._elementMap.get(element);
    if (!map) {
      return;
    }
    for (const [, instance] of map) {
      if (instance.OnDestroy) {
        instance.OnDestroy();
      }
    }
    this._elementMap.delete(element);
  }

  private found(attributeName: string, el: HTMLElement, oldVal?: string) {
    let map = this._elementMap.get(el);
    if (!map) {
      map = new Map();
      this._elementMap.set(el, map);
    }

    const modifier = map.get(attributeName);
    const attribute = el.getAttribute(attributeName);

    if (!modifier) {
      const Modifier = this.getConstructor(attributeName);
      const modifier = new Modifier();
      if (Modifier.options?.observedAttributes?.length) {
        for (const observedAttribute of Modifier.options.observedAttributes) {
          observe(modifier, observedAttribute);
        }
      }
      map.set(attributeName, modifier);
      modifier.element = el;
      modifier.selector = attributeName;
      modifier.value = attribute || modifier.value;
      modifier.parent = this.parent;

      if (modifier.OnInit) {
        modifier.OnInit();
      }
      return;
    }

    if (attribute == null && !!modifier.value) {
      modifier.value = attribute;
      if (modifier.OnDestroy) {
        modifier.OnDestroy();
      }
      map.delete(attributeName);
      return;
    }
    if (attribute !== modifier.value) {
      modifier.value = attribute;
      if (modifier.OnUpdate) {
        modifier.OnUpdate(oldVal, attribute);
      }
      return;
    }
  }
}
