export type Constructor<T> = new (...args: never[]) => T;

export interface Options {
  registry: Constructor<CustomAttributeRegistry>;
  name: string;
}

export abstract class Attribute<T = {}> {
  public static options(this: HTMLElement): Options {
    return;
  }
  public element?: HTMLElement;
  public value?: string;
  public name?: string;
  public parent?: HTMLElement | Document | ShadowRoot;
  setStyles(keys: T) {
    return (div: HTMLElement) => {
      for (const [key, value] of Object.entries(keys)) {
        div.style[key] = value;
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
    return this._attrMap.get(attrName);
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
    this.observer.observe(this.parent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
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
      modifier.name = attributeName;
      modifier.value = attribute;
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
