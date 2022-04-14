import { Attribute, Modifier } from '@rhtml/custom-attributes';
interface Styles {
  display: string;
}
@Modifier({
  selector: 'ngIf',
})
export class IfOperator extends Attribute<Styles> {
  OnInit() {
    this.modify();
  }

  OnDestroy() {
    this.element.style.display = null;
  }

  OnUpdate() {
    this.modify();
  }

  private modify() {
    if (this.value === 'true') {
      this.setStyles({ display: null })(this.element);
    } else {
      this.setStyles({ display: 'none' })(this.element);
    }
  }
}
