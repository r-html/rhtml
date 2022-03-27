import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  flex: string;
  boxSizing: string;
  maxWidth: string;
}

@Modifier({
  selector: 'fxFlex'
})
export class Flex extends Attribute<Styles> {
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
      boxSizing: null,
      maxWidth: null,
      flex: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      boxSizing: 'border-box',
      maxWidth: this.value || null,
      flex: '1 1 100%'
    })(this.element);
  }
}
