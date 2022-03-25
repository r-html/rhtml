import { Attribute, CustomAttributeRegistry } from '@rhtml/custom-attributes';

interface Styles {
  'flex-flow': string;
  'box-sizing': string;
  display: string;
}

export class Layout extends Attribute<Styles> {
  value = 'row';
  static options(this: HTMLElement) {
    return {
      name: 'fxLayout',
      registry: new CustomAttributeRegistry(this.shadowRoot)
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
      'flex-flow': null,
      display: null
    })(this.element);
  }
  private modify() {
    const splitted = this.value.split(' ');
    const [mainAxis, crossAxis] = splitted;
    this.setStyles({
      'box-sizing': 'flex',
      'flex-flow': splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis,
      display: 'flex'
    })(this.element);
  }
}
