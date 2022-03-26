import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  'place-content': string;
  'align-items': string;
  display: string;
}

@Modifier({
  selector: 'fxLayoutAlign'
})
export class LayoutAlign extends Attribute<Styles> {
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
      'align-items': null,
      'place-content': null,
      display: null
    })(this.element);
  }

  private modify() {
    const [mainAxis, crossAxis] = this.value.split(' ');
    this.setStyles({
      'align-items': crossAxis ? crossAxis : mainAxis,
      'place-content': crossAxis
        ? `${crossAxis} ${mainAxis}`
        : `${mainAxis} ${mainAxis}`,
      display: 'flex'
    })(this.element);
  }
}
