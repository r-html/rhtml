export type Constructor<T> = new (...args: never[]) => T;

const noop = function() {
  /*  */
};

interface ModifierOptions {
  selector: string;
  registry?(this: HTMLElement): CustomAttributeRegistry;
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
  const OnDestroy = prototype.OnInit || noop;
  const OnUpdateAttribute = prototype.OnUpdateAttribute || noop;

  let observer: MutationObserver;
  prototype.OnInit = function() {
    const element = this.element ?? this;
    if (observer) {
      observer.disconnect();
    }
    observer = new MutationObserver(() =>
      OnUpdateAttribute.call(this, memberName, element.getAttribute(memberName))
    );
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
  target: unknown,
  memberName: string
) => {
  Object.defineProperty(target, memberName, {
    get: function() {
      const element = this.element ?? this;
      return element.getAttribute(memberName.toLowerCase());
    }
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

/* Someone may like to use CustomAttribute instead of Modifier */
export const CustomAttribute = Modifier;

export abstract class Attribute<T = {}> {
  public static options: ModifierOptions;
  public element?: HTMLElement;
  public value?: string;
  public selector?: string;
  public parent?: HTMLElement | Document | ShadowRoot;
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

export class CustomAttributeRegistry {
  private _attrMap: Map<string, Constructor<Attribute>> = new Map();
  private _elementMap: WeakMap<
    HTMLElement,
    Map<string, Attribute>
  > = new WeakMap();
  private observer: MutationObserver;

  constructor(private parent: HTMLElement | Document | ShadowRoot) {
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
      const Constructor = this.getConstructor(attributeName);
      const modifier = new Constructor();
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
