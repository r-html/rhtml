import {
  createFiltersFromSelector,
  MediaQueryAttribute,
  MediaQueryEvent,
  Modifier,
} from '@rhtml/custom-attributes';

interface Styles {
  margin: string;
  flex?: string;
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

  OnChange() {
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
    const divs = [...this.element.children] as HTMLElement[];
    for (const div of divs) {
      this.setStyles({
        flex: null,
        margin: null,
      })(div);
    }
  }

  private modify() {
    const layout = this.element.getAttribute('fxlayout');
    const isRow = layout === 'row';
    const isColumn = layout === 'column';
    let margin: (string | number)[] = [this.value];
    if (isRow) {
      margin = [0, this.value, 0, 0];
    }
    if (isColumn) {
      margin = [0, 0, this.value, 0];
    }
    const divs = this.element.children;
    for (const div of divs) {
      this.setStyles({
        flex: '1 1 25%',
        margin: margin.join(' '),
      })(div);
    }
    const lastElement = this.element.children[this.element.children.length - 1];
    if (lastElement && isRow) {
      this.setStyles({
        margin: null,
      })(lastElement);
    }
  }
}
