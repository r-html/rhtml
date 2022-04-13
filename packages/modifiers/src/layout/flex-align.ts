import {
  EnterMediaQueryAttributes,
  MediaQueryAttribute,
  Modifier
} from '@rhtml/custom-attributes';

interface Styles {
  alignSelf: string;
}

@Modifier({
  selector: 'fxFlexAlign'
})
export class FlexAlign extends MediaQueryAttribute<Styles> {
  OnInit() {
    this.modify();
    super.OnInit();
  }

  OnDestroy() {
    this.clean();
    super.OnDestroy();
  }

  OnUpdate() {
    this.modify();
  }

  OnEnterMediaQuery([, attribute]: EnterMediaQueryAttributes) {
    this.prevValue = this.value;
    this.value = attribute.value ?? this.value;
    this.modify();
  }

  OnExitMediaQuery() {
    this.value = this.prevValue ?? this.value;
    this.modify();
  }

  private clean() {
    this.setStyles({ alignSelf: null })(this.element);
  }

  private modify() {
    this.setStyles({ alignSelf: this.value || null })(this.element);
  }
}
