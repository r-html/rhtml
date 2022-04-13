import {
  EnterMediaQueryAttributes,
  MediaQueryAttribute,
  Modifier
} from '@rhtml/custom-attributes';

interface Styles {
  flexFlow: string;
  boxSizing: string;
  display: string;
}

@Modifier({
  selector: 'fxLayout'
})
export class Layout extends MediaQueryAttribute<Styles> {
  value = 'row';

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
    this.element.setAttribute('fxlayout', this.value);
  }

  OnExitMediaQuery() {
    this.value = this.prevValue ?? this.value;
    this.modify();
    this.element.setAttribute('fxlayout', this.value);
  }

  clean() {
    this.setStyles({
      boxSizing: null,
      flexFlow: null,
      display: null
    })(this.element);
  }

  modify() {
    if (!this.value) {
      return;
    }
    const splitted = this.value.split(' ');
    const [mainAxis, crossAxis] = splitted;
    this.setStyles({
      boxSizing: 'flex',
      flexFlow: splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis,
      display: 'flex'
    })(this.element);
  }
}
