/* eslint-disable @typescript-eslint/no-unused-vars */
export type Constructor<T = {}> = new (...args: never[]) => T;

export abstract class Attribute {
  public element?: HTMLElement;
  public value?: string;
  public name?: string;
  OnInit(): void {
    /* */
  }
  OnDestroy(): void {
    /* */
  }
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

  constructor(private parent: HTMLElement | ShadowRoot) {
    if (!parent) {
      throw new Error('Must be given a parent element');
    }
    this.observe();
  }

  define(attrName: string, Constructor: Constructor<Attribute>) {
    this._attrMap.set(attrName, Constructor);
    this.upgradeAttribute(attrName);
  }

  get(element: HTMLElement, attrName: string) {
    const map = this._elementMap.get(element);
    if (!map) return;
    return map.get(attrName);
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

  private found(attrName: string, el: HTMLElement, oldVal?: string) {
    let map = this._elementMap.get(el);
    if (!map) {
      map = new Map();
      this._elementMap.set(el, map);
    }

    const modifier = map.get(attrName);
    const newValue = el.getAttribute(attrName);

    if (!modifier) {
      const Constructor = this.getConstructor(attrName);
      const modifier = new Constructor();
      map.set(attrName, modifier);
      modifier.element = el;
      modifier.name = attrName;
      modifier.value = newValue;
      if (modifier.OnInit) {
        modifier.OnInit();
      }
      return;
    }

    if (newValue == null && !!modifier.value) {
      modifier.value = newValue;
      if (modifier.OnDestroy) {
        modifier.OnDestroy();
      }
      map.delete(attrName);
      return;
    }

    if (newValue !== modifier.value) {
      modifier.value = newValue;
      if (modifier.OnUpdate) {
        modifier.OnUpdate(oldVal, newValue);
      }
      return;
    }
  }
}
