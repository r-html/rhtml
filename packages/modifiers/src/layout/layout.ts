import {
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  flexFlow: string;
  boxSizing: string;
  display: string;
}

@Modifier({
  selector: 'fxLayout',
})
export class Layout extends MediaQueryAttribute<Styles> {
  value = 'row';
  private prevValue: string;

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

  OnEnterMediaQuery([, attribute]: MediaQueryEvent) {
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
      flexFlow: null,
      display: null,
    })(this.element);
  }

  private modify() {
    if (!this.value) {
      return;
    }
    this.element.setAttribute(this.selector, this.value);
    const splitted = this.value.split(' ');
    const [mainAxis, crossAxis] = splitted;
    this.setStyles({
      boxSizing: 'flex',
      flexFlow: splitted.length > 1 ? `${mainAxis} ${crossAxis}` : mainAxis,
      display: 'flex',
    })(this.element);
  }
}
