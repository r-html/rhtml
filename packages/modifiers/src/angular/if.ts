import {
  Attribute,
  CustomAttributeRegistry,
  Modifier
} from '@rhtml/custom-attributes';

@Modifier({
  selector: 'ngIf',
  registry(this) {
    return new CustomAttributeRegistry(this);
  }
})
export class IfOperator extends Attribute {
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
