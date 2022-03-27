import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  flexFlow: string;
  boxSizing: string;
  display: string;
}

@Modifier({
  selector: 'fxLayout'
})
export class Layout extends Attribute<Styles> {
  value = 'row';

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
      flexFlow: null,
      display: null
    })(this.element);
  }
  private modify() {
    const splitted = this.value.split(' ');
    const [mainAxis, crossAxis] = splitted;
    this.setStyles({
      boxSizing: 'flex',
      flexFlow: splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis,
      display: 'flex'
    })(this.element);
  }
}
