import { Attribute } from './attribute';
import { observe } from './helpers';
import { Constructor } from './types';

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
    this.observer = new MutationObserver((mutations) => {
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
      attributeOldValue: true,
    });
  }

  unsubscribe(force?: boolean) {
    if (force) {
      this.observer?.disconnect();
    }
    const values = [...this._elementMap.values()];
    for (const elModifiers of values) {
      const modifiers = [...elModifiers.values()];
      for (const modifier of modifiers) {
        modifier.OnDestroy();
        if (modifier.observer) {
          modifier.observer.disconnect();
        }
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

    let modifier = map.get(attributeName);
    const attribute = el.getAttribute(attributeName);

    if (!modifier) {
      const Modifier = this.getConstructor(attributeName);
      modifier = new Modifier();
      if (Modifier.options?.observedAttributes?.length) {
        for (const observedAttribute of Modifier.options.observedAttributes) {
          observe(modifier, observedAttribute);
        }
      }
      modifier.element = el;
      modifier.selector = attributeName;

      modifier.value = attribute || modifier.value;
      modifier.parent = this.parent;

      if (modifier.OnInit) {
        modifier.OnInit();
      }
      if (Modifier.options.observe) {
        modifier.observer = new MutationObserver((records) =>
          modifier.OnChange(records)
        );
        modifier.observer.observe(modifier.element, Modifier.options.observe);
      }
      map.set(attributeName, modifier);
      return;
    }

    if (attribute == null && !!modifier.value) {
      modifier.value = attribute;
      if (modifier.OnDestroy) {
        modifier.OnDestroy();
      }
      if (modifier.observer) {
        modifier.observer.disconnect();
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
