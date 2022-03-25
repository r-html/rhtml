import { Attribute, CustomAttributeRegistry } from '@rhtml/custom-attributes';

export class IfOperator extends Attribute {
  static options(this: HTMLElement) {
    return {
      name: 'ngIf',
      registry: new CustomAttributeRegistry(this.shadowRoot)
    };
  }
  OnInit() {
    this.setColor();
  }

  OnDestroy() {
    this.element.style.display = null;
  }

  OnUpdate() {
    this.setColor();
  }

  setColor() {
    if (this.value === 'true') {
      this.element.style.display = null;
    } else {
      this.element.style.display = 'none';
    }
  }
}
