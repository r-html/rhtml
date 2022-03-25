import { Attribute } from '@rhtml/custom-attributes';

interface Styles {
  'margin-left': string;
}

export class FlexOffset extends Attribute<Styles> {
  static options(this: HTMLElement) {
    return {
      name: 'fxFlexOffset'
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
      'margin-left': null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      'margin-left': this.value || null
    })(this.element);
  }
}
