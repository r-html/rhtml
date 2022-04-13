import {
  EnterMediaQueryAttributes,
  MediaQueryAttribute,
  Modifier
} from '@rhtml/custom-attributes';

interface Styles {
  flex: string;
  boxSizing: string;
  maxWidth: string;
}

@Modifier({
  selector: 'fxFlex'
})
export class Flex extends MediaQueryAttribute<Styles> {
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
    this.setStyles({
      boxSizing: null,
      maxWidth: null,
      flex: null
    })(this.element);
  }

  private modify() {
    this.setStyles({
      boxSizing: 'border-box',
      maxWidth: this.value || null,
      flex: '1 1 100%'
    })(this.element);
  }
}
