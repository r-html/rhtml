import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  order: string;
}

@Modifier({
  selector: 'fxFlexOrder'
})
export class FlexOrder extends Attribute<Styles> {
  OnInit() {
    this.modify();
  }

  OnDestroy() {
    this.clean();
  }

  OnUpdate() {
    this.modify();
  }

  private clean() {
    this.setStyles({
      order: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      order: this.value || null
    })(this.element);
  }
}
