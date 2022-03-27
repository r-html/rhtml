import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  alignSelf: string;
}

@Modifier({
  selector: 'fxFlexAlign'
})
export class FlexAlign extends Attribute<Styles> {
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
    this.setStyles({ alignSelf: null })(this.element);
  }

  private modify() {
    this.setStyles({ alignSelf: this.value || null })(this.element);
  }
}
