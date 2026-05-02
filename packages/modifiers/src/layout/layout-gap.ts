import {
  createFiltersFromSelector,
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  gap: string;
}

@Modifier({
  selector: 'fxLayoutGap',
  observe: {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: createFiltersFromSelector('fxlayout'),
  },
})
export class LayoutGap extends MediaQueryAttribute<Styles> {
  OnInit() {
    this.modify();
    super.OnInit();
  }

  OnDestroy() {
    this.setStyles({ gap: null })(this.element);
    super.OnDestroy();
  }

  OnUpdate() {
    this.modify();
  }

  OnChange() {
    this.modify();
  }

  OnEnterMediaQuery([, attribute]: MediaQueryEvent) {
    this.value = attribute.value ?? this.value;
    this.modify();
  }

  OnExitMediaQuery() {
    this.modify();
  }

  modify() {
    this.setStyles({ gap: this.value })(this.element);
  }
}
