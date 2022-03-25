import { Attribute } from '@rhtml/custom-attributes';

interface Styles {
  flex: string;
  'box-sizing': string;
  'max-width': string;
}

export class Flex extends Attribute<Styles> {
  static options(this: HTMLElement) {
    return {
      name: 'fxFlex'
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
      'box-sizing': null,
      'max-width': null,
      flex: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      'box-sizing': 'border-box',
      'max-width': this.value || null,
      flex: '1 1 100%'
    })(this.element);
  }
}
