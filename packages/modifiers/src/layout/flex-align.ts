import { Attribute } from '@rhtml/custom-attributes';

interface Styles {
  'align-self': string;
}
export class FlexAlign extends Attribute<Styles> {
  static options(this: HTMLElement) {
    return {
      name: 'fxFlexAlign'
    };
  }

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
      'align-self': null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      'align-self': this.value || null
    })(this.element);
  }
}
