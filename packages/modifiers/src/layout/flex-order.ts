import { Attribute } from '@rhtml/custom-attributes';

interface Styles {
  order: string;
}

export class FlexOrder extends Attribute<Styles> {
  static options(this: HTMLElement) {
    return {
      name: 'fxFlexOrder'
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
      order: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      order: this.value || null
    })(this.element);
  }
}
