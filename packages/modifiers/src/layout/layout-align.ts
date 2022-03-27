import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  placeContent: string;
  alignItems: string;
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
      alignItems: null,
      placeContent: null,
      display: null
    })(this.element);
  }

  private modify() {
    const [mainAxis, crossAxis] = this.value.split(' ');
    this.setStyles({
      alignItems: crossAxis ? crossAxis : mainAxis,
      placeContent: crossAxis
        ? `${crossAxis} ${mainAxis}`
        : `${mainAxis} ${mainAxis}`,
      display: 'flex'
    })(this.element);
  }
}
