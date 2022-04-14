import {
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  placeContent: string;
  alignItems: string;
  display: string;
}

@Modifier({
  selector: 'fxLayoutAlign',
})
export class LayoutAlign extends MediaQueryAttribute<Styles> {
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
      alignItems: null,
      placeContent: null,
      display: null,
    })(this.element);
  }

  private modify() {
    const [mainAxis, crossAxis] = this.value.split(' ');
    this.setStyles({
      alignItems: crossAxis ? crossAxis : mainAxis,
      placeContent: crossAxis
        ? `${crossAxis} ${mainAxis}`
        : `${mainAxis} ${mainAxis}`,
      display: 'flex',
    })(this.element);
  }
}
