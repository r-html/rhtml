import { Attribute } from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
  width: string;
  height: string;
  'min-width': string;
  'min-height': string;
}

export class FlexFill extends Attribute<Styles> {
  static options(this: HTMLElement) {
    return {
      name: 'fxFlexFill'
    };
  }

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
      'min-height': null,
      'min-width': null,
      width: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      margin: '0',
      height: this.value,
      'min-height': this.value,
      'min-width': this.value,
      width: this.value
    })(this.element);
  }
}
