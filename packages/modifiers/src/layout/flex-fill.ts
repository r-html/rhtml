import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
}

@Modifier({
  selector: 'fxFlexFill',
})
export class FlexFill extends Attribute<Styles> {
  value = '100%';

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
      height: null,
      margin: null,
      minHeight: null,
      minWidth: null,
      width: null,
    })(this.element);
  }

  private modify() {
    this.setStyles({
      margin: '0',
      height: this.value,
      minHeight: this.value,
      minWidth: this.value,
      width: this.value,
    })(this.element);
  }
}
