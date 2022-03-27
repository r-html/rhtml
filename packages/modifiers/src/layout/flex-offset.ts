import { Attribute, Modifier } from '@rhtml/custom-attributes';

interface Styles {
  marginLeft: string;
}

@Modifier({
  selector: 'fxFlexOffset'
})
export class FlexOffset extends Attribute<Styles> {
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
      marginLeft: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      marginLeft: this.value || null
    })(this.element);
  }
}
